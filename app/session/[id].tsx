import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import type { IMessage } from 'react-native-gifted-chat';
import { ActivityIndicator, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { MessageReportDialog } from '@/components/chat/MessageReportDialog';
import { RatingDialog } from '@/components/chat/RatingDialog';
import { TitleEditDialog } from '@/components/chat/TitleEditDialog';
import type { ChatMessage } from '@/components/chat/types';
import { getCharacterImage } from '@/constants/characterImages';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useSessionMessages } from '@/hooks/useSessionMessages';
import { useUserProfile } from '@/hooks/useUserProfile';
import { showInterstitialAd } from '@/services/ads';
import { reportMessage, sendMessage } from '@/services/sessions';
import type {
  MessageItem,
  MessageReportReason,
  MessageReportRequest,
  PagedResponse,
  Session,
} from '@/services/sessions/types';
import { useToast } from '@/store/toastStore';
import { formatAIMessage } from '@/utils/textFormatting';

export default function SessionScreen() {
  const params = useLocalSearchParams<{
    id: string;
    characterId?: string;
    characterName?: string;
    title?: string;
    avatarUrl?: string;
    isBookmarked?: string;
  }>();
  const toast = useToast();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { profile } = useUserProfile();

  const sessionId = Number(params.id);
  const initialcharacterInfo = useMemo(
    () =>
      params.characterName
        ? {
            characterId: params.characterId ? Number(params.characterId) : undefined,
            characterName: params.characterName,
            avatarUrl: params.avatarUrl || undefined,
          }
        : undefined,
    [params.characterId, params.characterName, params.avatarUrl],
  );

  const {
    messages,
    addMessage,
    replaceLastMessage,
    removeLastMessage,
    characterInfo,
    sessionInfo,
    isLoading,
  } = useSessionMessages(sessionId, initialcharacterInfo);

  const [isBookmarked, setIsBookmarked] = useState(params.isBookmarked === 'true');
  const [isSending, setIsSending] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(params.title || '새 대화');
  const [isSessionClosed, setIsSessionClosed] = useState(false); // 세션 종료 상태 추적
  const [reportDialogVisible, setReportDialogVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<MessageItem | null>(null);
  const [_messageCount, setMessageCount] = useState(0); // 메시지 카운트 (4회마다 광고)

  const reportMessageMutation = useMutation({
    mutationFn: async ({
      messageId,
      reasonCode,
      detail,
    }: {
      messageId: number;
      reasonCode: MessageReportReason;
      detail?: string;
    }) => reportMessage(sessionId, messageId, { reasonCode, detail }),
    onSuccess: () => {
      toast.show('신고가 접수되었습니다.', 'success');
      setReportDialogVisible(false);
      setReportTarget(null);
    },
    onError: () => {
      toast.show('신고에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
    },
  });

  // Use custom hook for session actions
  const {
    showRatingDialog,
    showTitleDialog,
    rating,
    feedback,
    newTitle,
    setShowRatingDialog,
    setShowTitleDialog,
    setRating,
    setFeedback,
    setNewTitle,
    handleBookmarkToggle: handleBookmarkToggleAction,
    confirmEndSession,
    handleRatingSubmit: handleRatingSubmitAction,
    handleTitleEdit: handleTitleEditAction,
    handleTitleUpdate,
    isSubmittingRating,
    isUpdatingTitle,
  } = useSessionActions({
    sessionId,
    sessionInfo,
    characterId: characterInfo?.characterId || Number(params.characterId),
  });

  useEffect(() => {
    if (sessionInfo) {
      setIsBookmarked(sessionInfo.isBookmarked);
      setSessionTitle(sessionInfo.title);
      setNewTitle(sessionInfo.title);
    }
  }, [sessionInfo, setNewTitle]);

  // 대화 시작 시 광고 표시 (사용자가 "광고 보고 무료로 상담 시작하기" 버튼을 눌렀으므로 정책 준수)
  useEffect(() => {
    showInterstitialAd();
  }, []);

  const giftedChatMessages = useMemo<ChatMessage[]>(() => {
    return messages.map((msg) => {
      const isAI = msg.senderType === 'AI';
      const characterAvatar = characterInfo?.avatarUrl
        ? getCharacterImage(characterInfo.avatarUrl)
        : undefined;

      const formattedContent = isAI ? formatAIMessage(msg.content) : msg.content;

      return {
        _id: msg.messageId,
        text: formattedContent,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: isAI ? 2 : 1,
          name: isAI ? characterInfo?.characterName || 'AI' : profile?.nickname || '나',
          avatar: isAI ? characterAvatar : undefined,
        },
        original: msg,
      };
    });
  }, [messages, characterInfo, profile]);

  // Wrapper functions to integrate with custom hook
  const handleBookmarkToggle = useCallback(async () => {
    await handleBookmarkToggleAction();
    setIsBookmarked((prev) => !prev);
  }, [handleBookmarkToggleAction]);

  const handleEndSession = useCallback(() => {
    // 이미 세션이 종료된 경우 중복 요청 방지
    if (isSessionClosed) {
      toast.show('이미 종료된 대화입니다.', 'info');
      return;
    }

    Alert.alert('대화 종료', '대화을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: confirmEndSession, // 바로 endSessionMutation 실행
      },
    ]);
  }, [confirmEndSession, isSessionClosed, toast]);

  const handleTitleEdit = useCallback(() => {
    handleTitleEditAction(sessionTitle);
  }, [sessionTitle, handleTitleEditAction]);

  const handleTitleSave = useCallback(async () => {
    if (newTitle.trim() && newTitle !== sessionTitle) {
      try {
        await handleTitleUpdate();
        setSessionTitle(newTitle);
      } catch (_error) {
        // 에러는 handleTitleUpdate 내부에서 처리됨
      }
    } else {
      setShowTitleDialog(false);
    }
  }, [newTitle, sessionTitle, handleTitleUpdate, setShowTitleDialog]);

  // Convert backend rating (1-10) to frontend rating (0.5-5)
  const handleRatingSubmit = useCallback(() => {
    handleRatingSubmitAction();
  }, [handleRatingSubmitAction]);

  const handleMessageAction = useCallback((message: ChatMessage) => {
    if (!message?.original) return;
    setReportTarget(message.original);
    setReportDialogVisible(true);
  }, []);

  const handleReportSubmit = useCallback(
    (payload: MessageReportRequest) => {
      if (!reportTarget) return;
      reportMessageMutation.mutate({
        messageId: reportTarget.messageId,
        reasonCode: payload.reasonCode,
        detail: payload.detail,
      });
    },
    [reportTarget, reportMessageMutation],
  );

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0 || isSending) return;

      const userMessage = newMessages[0];
      setIsSending(true);

      const tempMessageId = Date.now();
      const tempCreatedAt = new Date().toISOString();

      // 사용자 메시지 추가 (백엔드 타입 그대로)
      addMessage({
        messageId: tempMessageId,
        content: userMessage.text,
        senderType: 'USER',
        createdAt: tempCreatedAt,
      });

      try {
        const response = await sendMessage(sessionId, userMessage.text);

        // AI 메시지에 줄바꿈이 포함되어 있음

        // 백엔드는 첫 메시지에만 sessionTitle을 보내줌
        if (response.sessionTitle) {
          setSessionTitle(response.sessionTitle);
          setNewTitle(response.sessionTitle);

          // React Query 캐시 업데이트: 세션 목록의 해당 세션 제목 동기화
          queryClient.setQueryData(
            ['sessions'],
            (oldData: InfiniteData<PagedResponse<Session>> | undefined) => {
              if (!oldData?.pages) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  content: page.content.map((session) =>
                    session.sessionId === sessionId
                      ? { ...session, title: response.sessionTitle }
                      : session,
                  ),
                })),
              };
            },
          );

          // React Query 캐시 업데이트: 세션 상세 정보의 제목도 동기화
          queryClient.setQueryData(
            ['sessions', sessionId],
            (oldSessionData: Session | undefined) => {
              if (!oldSessionData) return oldSessionData;
              return { ...oldSessionData, title: response.sessionTitle };
            },
          );
        }

        replaceLastMessage({
          messageId: response.userMessageId,
          content: response.userMessage,
          senderType: 'USER',
          createdAt: tempCreatedAt,
        });

        // AI 메시지 추가 (백엔드 타입 그대로)
        addMessage({
          messageId: response.aiMessageId,
          content: response.aiMessage,
          senderType: 'AI',
          createdAt: new Date().toISOString(),
        });

        // 메시지 카운트 증가 및 4회마다 광고 표시 (함수형 업데이트로 클로저 버그 방지)
        setMessageCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount % 4 === 0) {
            showInterstitialAd();
          }
          return newCount;
        });

        // 세션이 자동 종료되었는지 확인 (AI가 CLOSING 단계에서 종료)
        if (response.isSessionEnded) {
          // 세션 종료 상태 설정 (메시지 입력 비활성화)
          setIsSessionClosed(true);

          // 평가 다이얼로그 표시
          setShowRatingDialog(true);
          toast.show('대화이 종료되었습니다. 평가를 남겨주세요.', 'info');

          // 백엔드에서 이미 closedAt이 설정되어 세션이 종료된 상태
          // 수동 종료 버튼 클릭 시 중복 방지 필요
        }
      } catch (error: unknown) {
        // 타임아웃 에러인지 확인
        const isTimeout = error instanceof Error && error.message.includes('timeout');

        if (isTimeout) {
          toast.show('응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.', 'warning');
        } else {
          toast.show('메시지 전송에 실패했습니다', 'error');
        }

        // 실패한 사용자 메시지 제거 (중복 방지)
        removeLastMessage();
      } finally {
        setIsSending(false);
      }
    },
    [
      sessionId,
      isSending,
      addMessage,
      replaceLastMessage,
      removeLastMessage,
      toast,
      setNewTitle,
      setShowRatingDialog,
      queryClient,
    ],
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView
          style={[styles.keyboardView, { backgroundColor: theme.colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ChatHeader
            title={sessionTitle}
            characterAvatar={characterInfo?.avatarUrl}
            onTitleEdit={handleTitleEdit}
            onBookmarkToggle={handleBookmarkToggle}
            onEndSession={handleEndSession}
            isBookmarked={isBookmarked}
          />

          <ChatMessages
            messages={giftedChatMessages}
            onSend={onSend}
            isSessionClosed={isSessionClosed}
            isSending={isSending}
            onMessageAction={handleMessageAction}
          />

          <RatingDialog
            visible={showRatingDialog}
            selectedRating={rating}
            feedback={feedback}
            onRatingSelect={setRating}
            onFeedbackChange={setFeedback}
            onSubmit={handleRatingSubmit}
            onDismiss={() => setShowRatingDialog(false)}
            isSubmitting={isSubmittingRating}
          />

          <TitleEditDialog
            visible={showTitleDialog}
            title={newTitle}
            onTitleChange={setNewTitle}
            onSave={handleTitleSave}
            onDismiss={() => setShowTitleDialog(false)}
            isSaving={isUpdatingTitle}
          />

          <MessageReportDialog
            visible={reportDialogVisible}
            messagePreview={reportTarget?.content}
            onDismiss={() => {
              setReportDialogVisible(false);
              setReportTarget(null);
            }}
            onSubmit={handleReportSubmit}
            isSubmitting={reportMessageMutation.isPending}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
