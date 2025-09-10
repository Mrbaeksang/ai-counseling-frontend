import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { ActivityIndicator, Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { CustomAvatar } from '@/components/chat/CustomAvatar';
import { RatingDialog } from '@/components/chat/RatingDialog';
import { TitleEditDialog } from '@/components/chat/TitleEditDialog';
import { getCounselorImage } from '@/constants/counselorImages';
import { useSessionMessages } from '@/hooks/useSessionMessages';
import {
  endSession,
  rateSession,
  sendMessage,
  toggleSessionBookmark,
  updateSessionTitle,
} from '@/services/sessions';
import { useToast } from '@/store/toastStore';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const queryClient = useQueryClient();

  const sessionId = Number(id);
  const { messages, addMessage, counselorInfo, sessionInfo, isLoading } =
    useSessionMessages(sessionId);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [showTitleEditDialog, setShowTitleEditDialog] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('새 상담');

  useEffect(() => {
    if (sessionInfo) {
      setIsBookmarked(sessionInfo.isBookmarked);
      setSessionTitle(sessionInfo.title);
      setEditedTitle(sessionInfo.title);
    }
  }, [sessionInfo]);

  const giftedChatMessages = useMemo<IMessage[]>(() => {
    return messages.map((msg) => {
      const isAI = msg.role === 'AI';
      const counselorAvatar = counselorInfo?.avatarUrl
        ? getCounselorImage(counselorInfo.avatarUrl)
        : undefined;

      return {
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: isAI ? 2 : 1,
          name: isAI ? counselorInfo?.counselorName || 'AI' : '나',
          avatar: isAI ? counselorAvatar : undefined,
        },
      };
    });
  }, [messages, counselorInfo]);

  const handleTitleEdit = useCallback(() => {
    setEditedTitle(sessionTitle);
    setShowTitleEditDialog(true);
  }, [sessionTitle]);

  const handleTitleSave = useCallback(async () => {
    if (!editedTitle.trim() || editedTitle === sessionTitle) {
      setShowTitleEditDialog(false);
      return;
    }

    setIsSavingTitle(true);
    try {
      await updateSessionTitle(sessionId, editedTitle);
      setSessionTitle(editedTitle);
      toast.show('제목이 수정되었습니다', 'success');
      setShowTitleEditDialog(false);
    } catch (_error) {
      toast.show('제목 수정에 실패했습니다', 'error');
    } finally {
      setIsSavingTitle(false);
    }
  }, [editedTitle, sessionTitle, sessionId, toast]);

  const handleBookmarkToggle = useCallback(async () => {
    try {
      await toggleSessionBookmark(sessionId);
      setIsBookmarked((prev) => !prev);
      toast.show(isBookmarked ? '북마크가 해제되었습니다' : '북마크에 추가되었습니다', 'success');
    } catch (_error) {
      toast.show('북마크 변경에 실패했습니다', 'error');
    }
  }, [sessionId, isBookmarked, toast]);

  const handleEndSession = useCallback(() => {
    Alert.alert('상담 종료', '상담을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: async () => {
          setShowRatingDialog(true);
        },
      },
    ]);
  }, []);

  const handleRatingSubmit = useCallback(async () => {
    if (rating === 0) return;

    setIsSubmittingRating(true);
    try {
      // 1. 먼저 세션을 종료
      await endSession(sessionId);

      // 2. 그 다음 평가 제출
      await rateSession(sessionId, rating, feedback);

      const counselorId = counselorInfo?.counselorId;
      if (counselorId) {
        await queryClient.invalidateQueries({ queryKey: ['counselor', counselorId] });
        await queryClient.invalidateQueries({ queryKey: ['counselors'] });
      }

      toast.show('상담이 종료되었습니다. 소중한 평가 감사합니다!', 'success');
      router.replace('/(tabs)');
    } catch (_error) {
      toast.show('처리 중 오류가 발생했습니다', 'error');
    } finally {
      setIsSubmittingRating(false);
      setShowRatingDialog(false);
    }
  }, [rating, feedback, sessionId, counselorInfo, queryClient, toast, router]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0 || isSending) return;

      const userMessage = newMessages[0];
      setIsSending(true);

      // 임시 ID를 숫자로 생성
      const tempId = Date.now();
      const tempUserMessage: IMessage = {
        ...userMessage,
        _id: tempId,
        user: { _id: 1, name: '나' },
      };
      addMessage({
        id: tempId,
        content: tempUserMessage.text,
        role: 'USER',
        createdAt: new Date().toISOString(),
      });

      try {
        const response = await sendMessage(sessionId, userMessage.text);

        // 백엔드는 첫 메시지에만 sessionTitle을 보내줌
        if (response.sessionTitle) {
          setSessionTitle(response.sessionTitle);
          setEditedTitle(response.sessionTitle);
        }

        const aiMessageData = {
          id: Date.now() + 1,
          content: response.aiMessage,
          role: 'AI' as const,
          createdAt: new Date().toISOString(),
        };
        addMessage(aiMessageData);
      } catch (_error) {
        toast.show('메시지 전송에 실패했습니다', 'error');
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, isSending, addMessage, toast],
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
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top }]}
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
          visible={showTitleEditDialog}
          title={editedTitle}
          onTitleChange={setEditedTitle}
          onSave={handleTitleSave}
          onDismiss={() => setShowTitleEditDialog(false)}
          isSaving={isSavingTitle}
        />

        <Snackbar
          visible={toast.visible}
          onDismiss={toast.hide}
          duration={3000}
          action={{
            label: '닫기',
            onPress: toast.hide,
          }}
        >
          {toast.message}
        </Snackbar>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
