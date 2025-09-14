import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Divider, List, Text } from 'react-native-paper';
import { AccountDeleteDialog } from '@/components/profile/AccountDeleteDialog';
import { NicknameEditDialog } from '@/components/profile/NicknameEditDialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';
import { useToast } from '@/store/toastStore';

export default function ProfileScreen() {
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
    // 로그인 화면으로 즉시 이동
    router.replace('/(auth)/login');
  }, [logout, showToast]);

  // 개발용: 온보딩 리셋
  const handleResetOnboarding = useCallback(async () => {
    await resetOnboarding();
    showToast('온보딩이 초기화되었습니다. 앱을 재시작하세요.', 'success');
  }, [resetOnboarding, showToast]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        {profile?.profileImageUrl ? (
          <Avatar.Image size={80} source={{ uri: profile.profileImageUrl }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={80} icon="account" style={styles.avatar} />
        )}
        <Text variant="headlineMedium" style={styles.name}>
          {profile?.nickname || user?.nickname || '사용자'}
        </Text>
      </View>

      <Card style={styles.section}>
        <List.Item
          title="닉네임 변경"
          description="다른 사용자에게 보여질 이름을 변경합니다"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => setShowNicknameDialog(true)}
        />
      </Card>

      <Card style={styles.section}>
        <List.Item
          title="이용 약관"
          left={(props) => <List.Icon {...props} icon="file-document" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => showToast('준비 중입니다', 'info')}
        />
        <Divider />
        <List.Item
          title="개인정보 처리방침"
          left={(props) => <List.Icon {...props} icon="shield-lock" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => showToast('준비 중입니다', 'info')}
        />
      </Card>

      <Card style={styles.section}>
        <List.Item
          title="로그아웃"
          left={(props) => <List.Icon {...props} icon="logout" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleLogout}
        />
      </Card>

      {/* 개발용 온보딩 리셋 버튼 */}
      {__DEV__ && (
        <Card style={styles.section}>
          <List.Item
            title="온보딩 초기화 (개발용)"
            description="다음 앱 시작시 온보딩이 다시 표시됩니다"
            left={(props) => <List.Icon {...props} icon="restart" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleResetOnboarding}
          />
        </Card>
      )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    backgroundColor: '#6B46C1',
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  deleteButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  deleteButtonText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
