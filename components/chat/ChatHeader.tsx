import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';

interface ChatHeaderProps {
  title: string;
  counselorName?: string;
  counselorAvatar?: string;
  onTitleEdit: () => void;
  onBookmarkToggle: () => void;
  onEndSession: () => void;
  isBookmarked: boolean;
}

export const ChatHeader = React.memo(
  ({
    title,
    counselorName: _counselorName, // 향후 사용 예정
    counselorAvatar,
    onTitleEdit,
    onBookmarkToggle,
    onEndSession,
    isBookmarked,
  }: ChatHeaderProps) => {
    const theme = useTheme();
    const avatarSource = counselorAvatar ? getCounselorImage(counselorAvatar) : null;

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
          <View style={styles.counselorInfo}>
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
    paddingVertical: spacing.sm, // 16px → 8px로 줄임
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
  counselorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40, // 44 → 40으로 약간 줄임
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: '#6B46C1',
  },
  textContainer: {
    flex: 1,
  },
  counselorName: {
    fontSize: 15, // 사용하지 않지만 남겨둠
    fontFamily: 'Pretendard-Bold',
    color: '#6B46C1',
    marginBottom: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16, // 원래 크기로 복원
    fontFamily: 'Pretendard-SemiBold', // 원래 굵기로 복원
    color: '#111827', // 원래 색상으로 복원
    maxWidth: '85%',
  },
  editButton: {
    marginLeft: -8,
  },
  headerActions: {
    flexDirection: 'row',
  },
});
