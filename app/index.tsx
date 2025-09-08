import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import useAuthStore from '@/store/authStore';

export default function Index() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    // 저장된 토큰 확인
    loadStoredAuth();
  }, [loadStoredAuth]);

  // 로딩 중이면 스피너 표시
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  // 로딩 완료 후 리다이렉트
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
