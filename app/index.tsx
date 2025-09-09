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

  // 항상 로딩 스피너를 먼저 표시 (리다이렉트 전까지)
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6B46C1" />
      {/* 로딩 완료 후 리다이렉트 - 화면에는 보이지 않음 */}
      {!isLoading &&
        (isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />)}
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
