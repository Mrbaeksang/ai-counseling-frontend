import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountDeleteDialog } from '@/components/profile/AccountDeleteDialog';
import { NicknameEditDialog } from '@/components/profile/NicknameEditDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfoCard, type ProfileMenuItem } from '@/components/profile/ProfileInfoCard';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { spacing } from '@/constants/theme';
import { useUserProfile } from '@/hooks/useUserProfile';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import useThemeStore from '@/store/themeStore';
import { useToast } from '@/store/toastStore';

// 정적 스타일 정의 (컴포넌트 외부)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor는 동적으로 적용
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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const { resetOnboarding } = useOnboardingStore();
  const { mode: themeMode } = useThemeStore();
  const { show: showToast } = useToast();
  const { profile, isLoading, updateNickname, deleteAccount } = useUserProfile();

  // 백엔드와 동기화 안된 경우 감지
  if (user && !profile && !isLoading) {
    // 자동 로그아웃 실행
    logout().then(() => {
      showToast('세션이 만료되었습니다. 다시 로그인해주세요.', 'info');
    });
  }

  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

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

  // 테마 모드 표시 텍스트
  const getThemeModeText = useCallback((mode: typeof themeMode) => {
    switch (mode) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
        return '시스템 설정 따르기';
      default:
        return '시스템 설정 따르기';
    }
  }, []);

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

  const appearanceMenuItems: ProfileMenuItem[] = useMemo(
    () => [
      {
        id: 'theme-settings',
        title: '테마 설정',
        description: `현재: ${getThemeModeText(themeMode)}`,
        icon: 'palette',
        onPress: () => setShowThemeSelector(true),
      },
    ],
    [themeMode, getThemeModeText],
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
      <View
        style={[
          styles.container,
          styles.centerContent,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header with user info */}
        <ProfileHeader profile={profile} />

        {/* Account Settings - 로그인한 사용자만 */}
        {profile && <ProfileInfoCard items={accountMenuItems} />}

        {/* Appearance Settings */}
        <ProfileInfoCard items={appearanceMenuItems} />

        {/* Legal Information */}
        <ProfileInfoCard items={legalMenuItems} />

        {/* Actions - 로그인한 사용자만 */}
        {profile && <ProfileInfoCard items={actionMenuItems} />}

        {/* Development Tools (only in dev mode) */}
        {__DEV__ && <ProfileInfoCard items={devMenuItems} />}

        {/* Delete Account Button - 로그인한 사용자만 */}
        {profile && (
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
        )}
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

      <ThemeSelector visible={showThemeSelector} onDismiss={() => setShowThemeSelector(false)} />
    </View>
  );
}
