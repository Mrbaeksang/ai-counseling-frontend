import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Composer, GiftedChat, type IMessage, Send } from 'react-native-gifted-chat';
import { useTheme } from 'react-native-paper';
import { ChatBubble } from './ChatBubble';
import { ChatInputToolbar } from './ChatInputToolbar';
import { CustomAvatar } from './CustomAvatar';
import type { ChatMessage } from './types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onSend: (messages: IMessage[]) => void;
  isSessionClosed: boolean;
  isSending: boolean;
  onMessageAction?: (message: ChatMessage) => void;
}

export const ChatMessages = React.memo(
  ({ messages, onSend, isSessionClosed, isSending, onMessageAction }: ChatMessagesProps) => {
    const theme = useTheme();

    return (
      <GiftedChat<ChatMessage>
        messages={messages}
        onSend={onSend}
        user={{ _id: 1, name: '나' }}
        placeholder={isSessionClosed ? '대화이 종료되었습니다' : '메시지를 입력하세요...'}
        alwaysShowSend={!isSessionClosed}
        showUserAvatar={false}
        renderAvatar={(props) => <CustomAvatar {...props} />}
        renderBubble={(props) => <ChatBubble {...props} onPressAction={onMessageAction} />}
        renderUsernameOnMessage={false}
        renderTime={() => null}
        inverted={false}
        isTyping={isSending}
        infiniteScroll
        renderInputToolbar={
          isSessionClosed ? () => null : (props) => <ChatInputToolbar {...props} />
        }
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              color: theme.colors.onSurface,
              backgroundColor: theme.colors.surface,
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 8,
              marginLeft: 0,
              marginRight: 10,
            }}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        )}
        renderSend={(props) => (
          <Send {...props}>
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={theme.colors.primary}
              style={styles.sendButton}
            />
          </Send>
        )}
      />
    );
  },
);

const styles = StyleSheet.create({
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
});
