import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';
import type { UserProfileResponse } from '@/services/users/types';

interface ProfileHeaderProps {
  profile?: UserProfileResponse;
  avatarSize?: number;
}

// 스타일을 컴포넌트 외부에 정의 (정적)
const styles = StyleSheet.create({
  container: {
    // backgroundColor는 동적으로 적용
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    marginTop: 2,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    marginTop: spacing.md,
  },
  avatar: {
    // backgroundColor는 동적으로 적용
  },
  name: {
    marginTop: spacing.md,
    fontFamily: 'Pretendard-Bold',
  },
  email: {
    marginTop: spacing.xs,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    gap: spacing.xs,
  },
  providerText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
  },
});

export const ProfileHeader = React.memo(({ profile, avatarSize = 80 }: ProfileHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primaryContainer || '#F3E8FF' },
            ]}
          >
            <MaterialCommunityIcons name="account-circle" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>프로필</Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              내 정보를 관리하세요
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.profileSection,
          { borderTopColor: theme.colors.surfaceVariant || '#F3F4F6' },
        ]}
      >
        {profile?.profileImageUrl ? (
          <Avatar.Image
            size={avatarSize}
            source={{ uri: profile.profileImageUrl }}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
        ) : (
          <Avatar.Icon
            size={avatarSize}
            icon="account"
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
        )}
        <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onSurface }]}>
          {profile?.nickname || '사용자'}
        </Text>
        <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
          {profile?.email || '로그인이 필요합니다'}
        </Text>
        {profile?.authProvider && (
          <View
            style={[
              styles.providerBadge,
              { backgroundColor: theme.colors.primaryContainer || '#F3E8FF' },
            ]}
          >
            <MaterialCommunityIcons
              name={profile.authProvider === 'GOOGLE' ? 'google' : 'chat'}
              size={16}
              color={theme.colors.primary}
            />
            <Text style={[styles.providerText, { color: theme.colors.primary }]}>
              {profile.authProvider === 'GOOGLE' ? 'Google' : 'Kakao'} 계정
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});
