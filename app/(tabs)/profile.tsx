import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountDeleteDialog } from '@/components/profile/AccountDeleteDialog';
import { NicknameEditDialog } from '@/components/profile/NicknameEditDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfoCard, type ProfileMenuItem } from '@/components/profile/ProfileInfoCard';
import { spacing } from '@/constants/theme';
import { useUserProfile } from '@/hooks/useUserProfile';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import { useToast } from '@/store/toastStore';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const { show: showToast } = useToast();
  const { profile, isLoading, updateNickname, deleteAccount } = useUserProfile();

  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleNicknameUpdate = useCallback(
    async (nickname: string) => {
      updateNickname(nickname);
      setShowNicknameDialog(false);
    },
    [updateNickname],
  );

  const handleAccountDelete = useCallback(async () => {
    deleteAccount();
    setShowDeleteDialog(false);
  }, [deleteAccount]);

  const handleLogout = useCallback(async () => {
    await logout();
    showToast('로그아웃되었습니다', 'success');
    router.replace('/(auth)/login');
  }, [logout, showToast]);

  const handleResetOnboarding = useCallback(async () => {
    await resetOnboarding();
    showToast('온보딩이 초기화되었습니다. 앱을 재시작하세요.', 'success');
  }, [resetOnboarding, showToast]);

  // Profile menu items configuration
  const accountMenuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: 'nickname-edit',
        title: '닉네임 변경',
        description: '다른 사용자에게 보여질 이름을 변경합니다',
        icon: 'account-edit',
        onPress: () => setShowNicknameDialog(true),
      },
    ],
    [],
  );

  const legalMenuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: 'terms',
        title: '이용 약관',
        icon: 'file-document',
        onPress: () => showToast('준비 중입니다', 'info'),
      },
      {
        id: 'privacy',
        title: '개인정보 처리방침',
        icon: 'shield-lock',
        onPress: () => showToast('준비 중입니다', 'info'),
      },
    ],
    [showToast],
  );

  const actionMenuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: 'logout',
        title: '로그아웃',
        icon: 'logout',
        onPress: handleLogout,
      },
    ],
    [handleLogout],
  );

  const devMenuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: 'reset-onboarding',
        title: '온보딩 초기화 (개발용)',
        description: '다음 앱 시작시 온보딩이 다시 표시됩니다',
        icon: 'restart',
        onPress: handleResetOnboarding,
      },
    ],
    [handleResetOnboarding],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header with user info */}
        <ProfileHeader profile={profile} />

        {/* Account Settings */}
        <ProfileInfoCard items={accountMenuItems} />

        {/* Legal Information */}
        <ProfileInfoCard items={legalMenuItems} />

        {/* Actions */}
        <ProfileInfoCard items={actionMenuItems} />

        {/* Development Tools (only in dev mode) */}
        {__DEV__ && <ProfileInfoCard items={devMenuItems} />}

        {/* Delete Account Button */}
        <View style={styles.deleteButtonContainer}>
          <Button
            mode="text"
            onPress={() => setShowDeleteDialog(true)}
            textColor="#9CA3AF"
            labelStyle={styles.deleteButtonText}
            compact
          >
            회원 탈퇴
          </Button>
        </View>
      </ScrollView>

      {/* Dialogs */}
      <NicknameEditDialog
        visible={showNicknameDialog}
        currentNickname={profile?.nickname || user?.nickname || ''}
        onDismiss={() => setShowNicknameDialog(false)}
        onConfirm={handleNicknameUpdate}
      />

      <AccountDeleteDialog
        visible={showDeleteDialog}
        onDismiss={() => setShowDeleteDialog(false)}
        onConfirm={handleAccountDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: spacing.xl * 3,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonContainer: {
    marginTop: spacing.xl * 2,
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  deleteButtonText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    textDecorationLine: 'underline',
  },
});
