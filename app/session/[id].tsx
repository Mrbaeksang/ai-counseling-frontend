import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCounselorImage } from '@/constants/counselorImages';
import { colors, spacing } from '@/constants/theme';
import { useCounselorDetail } from '@/hooks/useCounselors';
import {
  endSession,
  getSessionMessages,
  rateSession,
  sendMessage,
  toggleSessionBookmark,
  updateSessionTitle,
} from '@/services/sessions';
import useAuthStore from '@/store/authStore';

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    id: string;
    counselorId?: string;
    counselorName?: string;
    title?: string;
    avatarUrl?: string;
    isBookmarked?: string; // "true" or "false" as string
  }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const sessionId = Number(params.id);
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [counselorId, _setCounselorId] = useState<number | null>(
    params.counselorId ? Number(params.counselorId) : null,
  );
  const [sessionTitle, setSessionTitle] = useState<string>(params.title || '상담 중');
  const [isBookmarked, setIsBookmarked] = useState(params.isBookmarked === 'true');
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showTitleEditDialog, setShowTitleEditDialog] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // 상담사 정보 조회 (counselorId가 설정된 후)
  const { data: counselor } = useCounselorDetail(counselorId || 0, {
    enabled: !!counselorId,
  });

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getSessionMessages(sessionId);

      // 아바타 이미지 가져오기
      const avatarUrl = counselor?.avatarUrl || params.avatarUrl;
      const avatarImage = getCounselorImage(avatarUrl);

      // 메시지를 GiftedChat 형식으로 변환
      const formattedMessages = response.content
        .map((msg) => ({
          _id: msg.id,
          text: msg.content,
          createdAt: new Date(msg.createdAt),
          user:
            msg.role === 'USER'
              ? {
                  _id: user?.userId || 1,
                  name: user?.name || user?.nickname || '나',
                  avatar: undefined, // 사용자는 아바타 없음
                }
              : {
                  _id: 2,
                  name: counselor?.name || params.counselorName || '상담사',
                  avatar: avatarImage || avatarUrl || undefined,
                },
        }))
        .reverse(); // GiftedChat은 최신 메시지가 첫번째

      setMessages(formattedMessages);
    } catch (_error) {
      Alert.alert('오류', '메시지를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, counselor, user, params.avatarUrl, params.counselorName]);

  // 초기 메시지 로드
  useEffect(() => {
    if (!sessionId) return;

    loadMessages();
  }, [sessionId, loadMessages]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (newMessages.length === 0 || isSending) return;

      const userMessage = newMessages[0];
      setIsSending(true);

      // 사용자 메시지 즉시 추가
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      try {
        // API 호출
        const response = await sendMessage(sessionId, userMessage.text);

        // AI 응답 추가
        const avatarUrl = counselor?.avatarUrl || params.avatarUrl;
        const avatarImage = getCounselorImage(avatarUrl);

        const aiMessage: IMessage = {
          _id: Date.now(),
          text: response.aiMessage,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: counselor?.name || params.counselorName || '상담사',
            avatar: avatarImage || avatarUrl || undefined,
          },
        };

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [aiMessage]));

        // 세션 제목이 업데이트되었으면 처리
        if (response.sessionTitle) {
          setSessionTitle(response.sessionTitle);
        }
      } catch (_error) {
        Alert.alert('오류', '메시지 전송에 실패했습니다.');
        // 실패한 메시지 롤백
        setMessages((previousMessages) =>
          previousMessages.filter((msg) => msg._id !== userMessage._id),
        );
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, counselor, isSending, params.avatarUrl, params.counselorName],
  );

  const handleBack = () => {
    router.back();
  };

  const handleToggleBookmark = async () => {
    try {
      const result = await toggleSessionBookmark(sessionId);
      setIsBookmarked(result.isBookmarked);
    } catch (_error) {
      Alert.alert('오류', '북마크 설정에 실패했습니다.');
    }
  };

  const handleEditTitle = () => {
    setEditingTitle(sessionTitle);
    setShowTitleEditDialog(true);
  };

  const handleSaveTitle = async () => {
    try {
      await updateSessionTitle(sessionId, editingTitle);
      setSessionTitle(editingTitle);
      setShowTitleEditDialog(false);
    } catch (_error) {
      Alert.alert('오류', '제목 수정에 실패했습니다.');
    }
  };

  const handleEndSession = () => {
    Alert.alert('세션 종료', '상담을 종료하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: async () => {
          try {
            await endSession(sessionId);
            // 세션 종료 후 평가 다이얼로그 표시
            setShowRatingDialog(true);
          } catch (_error) {
            Alert.alert('오류', '세션 종료에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleRateSession = async () => {
    try {
      await rateSession(sessionId, rating, feedback);

      // 상담사 데이터 캐시 무효화 (통계 업데이트 반영)
      if (counselorId) {
        await queryClient.invalidateQueries({ queryKey: ['counselor', counselorId] });
        await queryClient.invalidateQueries({ queryKey: ['counselors'] });
      }

      setShowRatingDialog(false);
      router.replace('/(tabs)');
    } catch (_error) {
      Alert.alert('오류', '평가 제출에 실패했습니다.');
      setShowRatingDialog(false);
      router.replace('/(tabs)');
    }
  };

  const handleSkipRating = () => {
    setShowRatingDialog(false);
    router.replace('/(tabs)');
  };

  // 커스텀 아바타 렌더링
  const renderAvatar = (props: any) => {
    const { currentMessage } = props;
    if (currentMessage?.user?._id === 2) {
      // 상담사 메시지인 경우
      const avatarSource = currentMessage.user.avatar;
      if (avatarSource) {
        return <Image source={avatarSource} style={styles.customAvatar} />;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content
          title={
            <View style={styles.titleContainer}>
              <Text style={styles.titleText} numberOfLines={1}>
                {sessionTitle || counselor?.name || '상담 중'}
              </Text>
              <IconButton
                icon="pencil"
                size={16}
                iconColor="#6B7280"
                onPress={handleEditTitle}
                style={styles.editButton}
              />
            </View>
          }
        />
        <Appbar.Action
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          onPress={handleToggleBookmark}
        />
        <Appbar.Action icon="close" onPress={handleEndSession} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: user?.userId || 1,
            name: user?.name || user?.nickname || '나',
          }}
          placeholder="메시지를 입력하세요..."
          alwaysShowSend
          scrollToBottom
          renderLoading={() => <ActivityIndicator size="large" color={colors.primary[600]} />}
          isTyping={isSending}
          messagesContainerStyle={styles.messagesContainer}
          locale="ko"
          renderTime={() => null} // 시간 표시 제거
          renderDay={() => null} // 날짜 표시 제거
          showUserAvatar={false} // 사용자 아바타 숨김
          showAvatarForEveryMessage={false} // 연속 메시지는 아바타 한 번만
          renderAvatar={renderAvatar} // 커스텀 아바타 렌더링
          textInputProps={{
            autoCapitalize: 'none',
            autoCorrect: false,
            autoComplete: 'off',
            keyboardType: 'default',
            returnKeyType: 'send',
            blurOnSubmit: false,
            multiline: true,
            enablesReturnKeyAutomatically: true,
            // Android 한글 입력 지원
            autoCompleteType: 'off',
            textContentType: 'none',
            importantForAutofill: 'no',
          }}
        />
      </KeyboardAvoidingView>

      {/* 평가 다이얼로그 */}
      <Portal>
        <Dialog visible={showRatingDialog} onDismiss={handleSkipRating}>
          <Dialog.Title>상담 평가</Dialog.Title>
          <Dialog.Content>
            <Text style={{ marginBottom: 16 }}>상담은 어떠셨나요?</Text>

            {/* 별점 선택 */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  icon={rating >= star ? 'star' : 'star-outline'}
                  size={32}
                  iconColor={rating >= star ? '#FFB800' : '#9CA3AF'}
                  onPress={() => setRating(star)}
                />
              ))}
            </View>

            {/* 피드백 입력 */}
            <TextInput
              mode="outlined"
              label="추가 의견 (선택사항)"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={3}
              placeholder="상담에 대한 의견을 남겨주세요"
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={handleSkipRating}>건너뛰기</Button>
            <Button mode="contained" onPress={handleRateSession}>
              평가 제출
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* 제목 수정 다이얼로그 */}
        <Dialog visible={showTitleEditDialog} onDismiss={() => setShowTitleEditDialog(false)}>
          <Dialog.Title>세션 제목 수정</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="새로운 제목"
              value={editingTitle}
              onChangeText={setEditingTitle}
              placeholder="세션 제목을 입력하세요"
              autoFocus
              maxLength={50}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setShowTitleEditDialog(false)}>취소</Button>
            <Button mode="contained" onPress={handleSaveTitle} disabled={!editingTitle.trim()}>
              저장
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  editButton: {
    margin: 0,
    marginLeft: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: spacing.sm,
  },
  customAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
