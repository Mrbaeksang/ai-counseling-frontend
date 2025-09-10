import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { CustomAvatar } from '@/components/chat/CustomAvatar';
import { RatingDialog } from '@/components/chat/RatingDialog';
import { TitleEditDialog } from '@/components/chat/TitleEditDialog';
import { getCounselorImage } from '@/constants/counselorImages';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useSessionMessages } from '@/hooks/useSessionMessages';
import { sendMessage } from '@/services/sessions';
import { useToast } from '@/store/toastStore';

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

  const { messages, addMessage, counselorInfo, sessionInfo, isLoading } = useSessionMessages(
    sessionId,
    initialCounselorInfo,
  );

  const [isBookmarked, setIsBookmarked] = useState(params.isBookmarked === 'true');
  const [isSending, setIsSending] = useState(false);
  const [sessionTitle, setSessionTitle] = useState(params.title || '새 상담');

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

      return {
        _id: index + 1, // GiftedChat용 임시 ID
        text: msg.content,
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
    Alert.alert('상담 종료', '상담을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: confirmEndSession, // 바로 endSessionMutation 실행
      },
    ]);
  }, [confirmEndSession]);

  const handleTitleEdit = useCallback(() => {
    setNewTitle(sessionTitle);
    handleTitleEditAction();
  }, [sessionTitle, setNewTitle, handleTitleEditAction]);

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
      } catch (_error: unknown) {
        toast.show('메시지 전송에 실패했습니다', 'error');
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, isSending, addMessage, toast, setNewTitle],
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ChatHeader
            title={sessionTitle}
            onTitleEdit={handleTitleEdit}
            onBookmarkToggle={handleBookmarkToggle}
            onEndSession={handleEndSession}
            isBookmarked={isBookmarked}
          />

          <GiftedChat
            messages={giftedChatMessages}
            onSend={onSend}
            user={{ _id: 1, name: '나' }}
            placeholder="메시지를 입력하세요..."
            alwaysShowSend
            showUserAvatar={false}
            renderAvatar={(props) => <CustomAvatar {...props} />}
            renderUsernameOnMessage={false}
            renderTime={() => null}
            inverted={false}
            isTyping={isSending}
            scrollToBottom
            infiniteScroll
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
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
