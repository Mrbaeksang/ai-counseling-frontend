import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    // 저장된 토큰 확인
    loadStoredAuth();
  }, [
    // 저장된 토큰 확인
    loadStoredAuth,
  ]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // 로그인되어 있으면 메인 화면으로
        router.replace('/(tabs)');
      } else {
        // 로그인 안되어 있으면 로그인 화면으로
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  // 로딩 중 표시
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#6B46C1" />
    </View>
  );
}
