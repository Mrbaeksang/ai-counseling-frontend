import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';

interface ChatHeaderProps {
  title: string;
  characterName?: string;
  characterAvatar?: string;
  onTitleEdit: () => void;
  onBookmarkToggle: () => void;
  onEndSession: () => void;
  isBookmarked: boolean;
}

export const ChatHeader = React.memo(
  ({
    title,
    characterName,
    characterAvatar,
    onTitleEdit,
    onBookmarkToggle,
    onEndSession,
    isBookmarked,
  }: ChatHeaderProps) => {
    const theme = useTheme();
    const avatarSource = characterAvatar ? getCharacterImage(characterAvatar) : null;

    return (
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.outlineVariant,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={theme.colors.onSurface}
          onPress={() => router.back()}
        />
        <View style={styles.headerCenter}>
          <View style={styles.characterInfo}>
            {avatarSource && (
              <Image
                source={avatarSource}
                style={[styles.avatar, { borderColor: theme.colors.primary }]}
              />
            )}
            <View style={styles.textContainer}>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {title || '새 상담'}
                </Text>
                <AnimatedButton
                  onPress={onTitleEdit}
                  style={styles.editButton}
                  scaleTo={0.85}
                  springConfig={{ damping: 15, stiffness: 200 }}
                >
                  <IconButton
                    icon="pencil-outline"
                    size={16}
                    iconColor={theme.colors.onSurfaceVariant}
                  />
                </AnimatedButton>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            iconColor={isBookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
            onPress={onBookmarkToggle}
          />
          <IconButton
            icon="exit-to-app"
            size={24}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={onEndSession}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm, // 16px ??8px�?줄임
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    elevation: 2,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40, // 44 ??40?�로 ?�간 줄임
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  textContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#6B46C1',
    marginBottom: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16, // ?�래 ?�기�?복원
    fontFamily: 'Pretendard-SemiBold', // ?�래 굵기�?복원
    color: '#111827', // ?�래 ?�상?�로 복원
    maxWidth: '85%',
  },
  editButton: {
    marginLeft: -8,
  },
  headerActions: {
    flexDirection: 'row',
  },
});
