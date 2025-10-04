import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';
import { ChatMessageItem } from './ChatMessageItem';
import type { ChatMessage } from './types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onSend: (
    messages: { _id: number; text: string; createdAt: Date; user: { _id: number } }[],
  ) => void;
  isSessionClosed: boolean;
  isSending: boolean;
  onMessageAction?: (message: ChatMessage) => void;
}

export const ChatMessages = React.memo(
  ({ messages, onSend, isSessionClosed, isSending, onMessageAction }: ChatMessagesProps) => {
    const theme = useTheme();
    const [inputText, setInputText] = React.useState('');
    const flatListRef = useRef<FlatList>(null);

    // 메시지가 추가되거나 변경되면 자동으로 맨 아래로 스크롤
    useEffect(() => {
      if (messages.length > 0 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, [messages.length]);

    const handleSend = useCallback(() => {
      if (inputText.trim() && !isSending) {
        onSend([
          {
            _id: Date.now(),
            text: inputText.trim(),
            createdAt: new Date(),
            user: { _id: 1 },
          },
        ]);
        setInputText('');
      }
    }, [inputText, isSending, onSend]);

    const renderMessage = useCallback(
      ({ item }: { item: ChatMessage }) => (
        <ChatMessageItem message={item} onPressAction={onMessageAction} />
      ),
      [onMessageAction],
    );

    const keyExtractor = useCallback((item: ChatMessage) => String(item._id), []);

    return (
      <View style={styles.container}>
        {/* 메시지 리스트 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          inverted={false}
          style={[styles.messageList, { backgroundColor: theme.colors.background }]}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* 입력창 */}
        {!isSessionClosed && (
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  color: theme.colors.onSurface,
                  backgroundColor: theme.colors.background,
                },
              ]}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              editable={!isSending}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              autoCorrect={false}
              autoComplete="off"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isSending}
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending) && styles.sendButtonDisabled,
              ]}
            >
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={
                  inputText.trim() && !isSending
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: spacing.sm,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    minHeight: 56,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 40,
    fontFamily: 'Pretendard-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
