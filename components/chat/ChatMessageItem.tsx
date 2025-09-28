import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import type { ChatMessage } from './types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onPressAction?: (message: ChatMessage) => void;
}

export const ChatMessageItem = React.memo(({ message, onPressAction }: ChatMessageItemProps) => {
  const theme = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const isAI = message.user._id === 2;

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
    // 메뉴가 표시 중이면 메뉴 숨기기
    if (showMenu) {
      setShowMenu(false);
    }
  };

  // 배경색 설정
  const backgroundColor = isAI ? theme.colors.surface : theme.colors.background;

  // 아바타 이미지 가져오기 (안전하게 처리)
  const avatarSource =
    isAI && message.user.avatar && typeof message.user.avatar === 'string'
      ? getCharacterImage(message.user.avatar)
      : null;

  return (
    <Pressable
      onLongPress={handleLongPress}
      onPress={handlePress}
      delayLongPress={500}
      style={({ pressed }) => [styles.messageRow, { backgroundColor }, pressed && styles.pressed]}
    >
      {/* 아바타 영역 */}
      <View style={styles.avatarContainer}>
        {isAI ? (
          avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>AI</Text>
            </View>
          )
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.secondary }]}>
            <Text style={styles.avatarText}>나</Text>
          </View>
        )}
      </View>

      {/* 메시지 컨텐츠 영역 */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.userName, { color: theme.colors.onSurfaceVariant }]}>
            {message.user.name}
          </Text>
          {isAI && showMenu && (
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
        <Text style={[styles.messageText, { color: theme.colors.onSurface }]} selectable>
          {message.text}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  pressed: {
    opacity: 0.95,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    marginRight: spacing.md,
    marginTop: 2,
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
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
  },
  menuButton: {
    padding: 4,
    borderRadius: 4,
  },
});
