import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';
import type { UserProfileResponse } from '@/services/users/types';

interface ProfileHeaderProps {
  profile?: UserProfileResponse;
  avatarSize?: number;
}

export const ProfileHeader = React.memo(({ profile, avatarSize = 80 }: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account-circle" size={20} color="#6B46C1" />
          </View>
          <View>
            <Text style={styles.title}>프로필</Text>
            <Text style={styles.subtitle}>내 정보를 관리하세요</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileSection}>
        {profile?.profileImageUrl ? (
          <Avatar.Image
            size={avatarSize}
            source={{ uri: profile.profileImageUrl }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Icon size={avatarSize} icon="account" style={styles.avatar} />
        )}
        <Text variant="headlineMedium" style={styles.name}>
          {profile?.nickname || '사용자'}
        </Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <View style={styles.providerBadge}>
          <MaterialCommunityIcons
            name={
              profile?.authProvider === 'GOOGLE'
                ? 'google'
                : profile?.authProvider === 'KAKAO'
                  ? 'chat'
                  : 'alpha-n-box'
            }
            size={16}
            color="#6B46C1"
          />
          <Text style={styles.providerText}>
            {profile?.authProvider === 'GOOGLE'
              ? 'Google'
              : profile?.authProvider === 'KAKAO'
                ? 'Kakao'
                : 'Naver'}{' '}
            계정
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: spacing.md,
  },
  avatar: {
    backgroundColor: '#6B46C1',
  },
  name: {
    marginTop: spacing.md,
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
  },
  email: {
    marginTop: spacing.xs,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    gap: spacing.xs,
  },
  providerText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#6B46C1',
  },
});
