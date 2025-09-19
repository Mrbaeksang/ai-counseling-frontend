import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';

export default function Index() {
  const { isLoading: authLoading, loadStoredAuth } = useAuthStore();
  const { isLoading: onboardingLoading, checkOnboardingStatus } = useOnboardingStore();

  useEffect(() => {
    // 저장된 토큰과 온보딩 상태 확인
    Promise.all([loadStoredAuth(), checkOnboardingStatus()]);
  }, [loadStoredAuth, checkOnboardingStatus]);

  const isLoading = authLoading || onboardingLoading;

  // 항상 로딩 스피너를 먼저 표시 (리다이렉트 전까지)
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6B46C1" />
      {/* 로딩 완료 후 홈으로 리다이렉트 - 로그인 여부와 관계없이 */}
      {!isLoading && <Redirect href="/(tabs)" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
