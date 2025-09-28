import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { ChatMessage } from './types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onPressAction?: (message: ChatMessage) => void;
}

export const ChatMessageItem = React.memo(({ message, onPressAction }: ChatMessageItemProps) => {
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const { profile } = useUserProfile();

  const isAI = message.user._id === 2;
  const isUser = !isAI;

  const handleLongPress = () => {
    if (isAI && onPressAction) {
      setShowMenu(true);
    }
  };

  const handleMenuPress = () => {
    if (onPressAction) {
      onPressAction(message);
      setShowMenu(false);
    }
  };

  const handlePress = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  // 아바타 이미지 결정
  const getAvatarSource = () => {
    if (isAI) {
      // avatar가 이미 이미지 소스 객체인 경우 그대로 사용
      if (message.user.avatar) {
        return typeof message.user.avatar === 'string'
          ? getCharacterImage(message.user.avatar)
          : message.user.avatar;
      }
      return null;
    } else {
      // 사용자 프로필 이미지 사용
      return profile?.profileImageUrl ? { uri: profile.profileImageUrl } : null;
    }
  };

  const avatarSource = getAvatarSource();

  // ChatGPT 스타일 레이아웃
  if (isUser) {
    // 사용자 메시지: 오른쪽 정렬
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMessageRow}>
          <View style={styles.userContentContainer}>
            <View style={[styles.userMessageBubble, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.userMessageText, { color: '#FFFFFF' }]} selectable>
                {message.text}
              </Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.secondary }]}>
                <Text style={styles.avatarText}>나</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    // AI 메시지: 왼쪽 정렬
    return (
      <Pressable
        onLongPress={handleLongPress}
        onPress={handlePress}
        delayLongPress={500}
        style={({ pressed }) => [styles.aiMessageContainer, pressed && styles.pressed]}
      >
        <View style={styles.aiMessageRow}>
          <View style={styles.avatarContainer}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.avatarText}>AI</Text>
              </View>
            )}
          </View>

          <View style={styles.aiContentContainer}>
            <View style={styles.aiHeaderRow}>
              <Text style={[styles.userName, { color: theme.colors.onSurfaceVariant }]}>
                {message.user.name}
              </Text>
              {showMenu && (
                <Pressable
                  onPress={handleMenuPress}
                  style={styles.menuButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                </Pressable>
              )}
            </View>
            <View style={[styles.aiMessageBubble, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.aiMessageText, { color: theme.colors.onSurface }]} selectable>
                {message.text}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }
});

const styles = StyleSheet.create({
  // 사용자 메시지 스타일 (오른쪽 정렬)
  userMessageContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  userContentContainer: {
    maxWidth: '75%',
    marginRight: spacing.sm,
  },
  userMessageBubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderBottomRightRadius: 6,
  },
  userMessageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },

  // AI 메시지 스타일 (왼쪽 정렬)
  aiMessageContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  aiMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiContentContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  aiMessageBubble: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  aiMessageText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
  },

  // 공통 스타일
  pressed: {
    opacity: 0.95,
  },
  avatarContainer: {
    width: 32,
    height: 32,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  menuButton: {
    padding: 4,
    borderRadius: 4,
  },
});
