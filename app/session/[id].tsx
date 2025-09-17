import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import type { IMessage } from 'react-native-gifted-chat';
import { ActivityIndicator, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { RatingDialog } from '@/components/chat/RatingDialog';
import { TitleEditDialog } from '@/components/chat/TitleEditDialog';
import { getCounselorImage } from '@/constants/counselorImages';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useSessionMessages } from '@/hooks/useSessionMessages';
import { sendMessage } from '@/services/sessions';
import { useToast } from '@/store/toastStore';
import { formatAIMessage } from '@/utils/textFormatting';

export default function SessionScreen() {
  const params = useLocalSearchParams<{
    id: string;
    counselorId?: string;
    counselorName?: string;
    title?: string;
    avatarUrl?: string;
    isBookmarked?: string;
  }>();
  const toast = useToast();
  const theme = useTheme();

  const sessionId = Number(params.id);
  const initialCounselorInfo = useMemo(
    () =>
      params.counselorName
        ? {
            counselorId: params.counselorId ? Number(params.counselorId) : undefined,
            counselorName: params.counselorName,
            avatarUrl: params.avatarUrl || undefined,
          }
        : undefined,
    [params.counselorId, params.counselorName, params.avatarUrl],
  );

  const { messages, addMessage, removeLastMessage, counselorInfo, sessionInfo, isLoading } =
    useSessionMessages(sessionId, initialCounselorInfo);

  const [isBookmarked, setIsBookmarked] = useState(params.isBookmarked === 'true');
  const [isSending, setIsSending] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(params.title || '새 상담');
  const [isSessionClosed, setIsSessionClosed] = useState(false); // 세션 종료 상태 추적

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
    counselorId: counselorInfo?.counselorId || Number(params.counselorId),
  });

  useEffect(() => {
    if (sessionInfo) {
      setIsBookmarked(sessionInfo.isBookmarked);
      setSessionTitle(sessionInfo.title);
      setNewTitle(sessionInfo.title);
    }
  }, [sessionInfo, setNewTitle]);

  const giftedChatMessages = useMemo<IMessage[]>(() => {
    return messages.map((msg, index) => {
      const isAI = msg.senderType === 'AI';
      const counselorAvatar = counselorInfo?.avatarUrl
        ? getCounselorImage(counselorInfo.avatarUrl)
        : undefined;

      // AI 메시지는 포맷팅 적용, 사용자 메시지는 그대로
      const formattedContent = isAI ? formatAIMessage(msg.content) : msg.content;

      return {
        _id: index + 1, // GiftedChat용 임시 ID
        text: formattedContent,
        createdAt: new Date(), // GiftedChat용 임시 시간
        user: {
          _id: isAI ? 2 : 1,
          name: isAI ? counselorInfo?.counselorName || 'AI' : '나',
          avatar: isAI ? counselorAvatar : undefined,
        },
      };
    });
  }, [messages, counselorInfo]);

  // Wrapper functions to integrate with custom hook
  const handleBookmarkToggle = useCallback(async () => {
    await handleBookmarkToggleAction();
    setIsBookmarked((prev) => !prev);
  }, [handleBookmarkToggleAction]);

  const handleEndSession = useCallback(() => {
    // 이미 세션이 종료된 경우 중복 요청 방지
    if (isSessionClosed) {
      toast.show('이미 종료된 상담입니다.', 'info');
      return;
    }

    Alert.alert('상담 종료', '상담을 종료하시겠습니까?', [
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
      await handleTitleUpdate();
      setSessionTitle(newTitle);
    } else {
      setShowTitleDialog(false);
    }
  }, [newTitle, sessionTitle, handleTitleUpdate, setShowTitleDialog]);

  // Convert backend rating (1-10) to frontend rating (0.5-5)
  const handleRatingSubmit = useCallback(() => {
    handleRatingSubmitAction();
  }, [handleRatingSubmitAction]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0 || isSending) return;

      const userMessage = newMessages[0];
      setIsSending(true);

      // 사용자 메시지 추가 (백엔드 타입 그대로)
      addMessage({
        content: userMessage.text,
        senderType: 'USER',
      });

      try {
        const response = await sendMessage(sessionId, userMessage.text);

        // AI 메시지에 줄바꿈이 포함되어 있음

        // 백엔드는 첫 메시지에만 sessionTitle을 보내줌
        if (response.sessionTitle) {
          setSessionTitle(response.sessionTitle);
          setNewTitle(response.sessionTitle);
        }

        // AI 메시지 추가 (백엔드 타입 그대로)
        addMessage({
          content: response.aiMessage,
          senderType: 'AI',
        });

        // 세션이 자동 종료되었는지 확인 (AI가 CLOSING 단계에서 종료)
        if (response.isSessionEnded) {
          // 세션 종료 상태 설정 (메시지 입력 비활성화)
          setIsSessionClosed(true);

          // 평가 다이얼로그 표시
          setShowRatingDialog(true);
          toast.show('상담이 종료되었습니다. 평가를 남겨주세요.', 'info');

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
    [sessionId, isSending, addMessage, removeLastMessage, toast, setNewTitle, setShowRatingDialog],
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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ChatHeader
            title={sessionTitle}
            counselorName={counselorInfo?.counselorName}
            counselorAvatar={counselorInfo?.avatarUrl}
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
