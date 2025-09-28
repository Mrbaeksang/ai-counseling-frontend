import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BubbleProps } from 'react-native-gifted-chat';
import { useTheme } from 'react-native-paper';
import type { ChatMessage } from './types';

interface ChatBubbleProps extends BubbleProps<ChatMessage> {
  onPressAction?: (message: ChatMessage) => void;
}

export const ChatBubble = React.memo(({ onPressAction, ...props }: ChatBubbleProps) => {
  const theme = useTheme();
  const isLeft = props.position === 'left';
  const currentMessage = props.currentMessage;
  const [showMenu, setShowMenu] = useState(false);

  if (!currentMessage) return null;

  const handleLongPress = () => {
    if (isLeft && onPressAction) {
      setShowMenu(true);
    }
  };

  const handleMenuPress = () => {
    if (onPressAction && currentMessage) {
      onPressAction(currentMessage);
      setShowMenu(false);
    }
  };

  // ChatGPT 스타일: 전체 너비 사용, 패딩으로 여백 조절
  const containerStyle = isLeft
    ? {
        backgroundColor: theme.colors.surface,
        alignSelf: 'stretch' as const,
      }
    : {
        backgroundColor: `${theme.colors.primary}10`, // 10% 투명도
        alignSelf: 'stretch' as const,
      };

  const textColor = isLeft ? theme.colors.onSurface : theme.colors.onSurface;

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={500}>
      <View style={[styles.messageContainer, containerStyle]}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.messageText, { color: textColor }]}>{currentMessage.text}</Text>

          {/* AI 메시지에만 더보기 버튼 표시 (showMenu true일 때만) */}
          {isLeft && showMenu && (
            <Pressable
              onPress={handleMenuPress}
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  messageContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 1, // 메시지 간 최소 간격
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    paddingRight: 8,
    fontFamily: 'Pretendard-Regular',
  },
  menuButton: {
    marginLeft: 8,
    padding: 4,
  },
});
