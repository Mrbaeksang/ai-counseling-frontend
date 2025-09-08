import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import authService from '@/services/authService';

// Google OAuth 설정
GoogleSignin.configure({
  webClientId: '470745173996-2m81qutdnesqnqprc55n8cce7lrr7hm5.apps.googleusercontent.com',
});

export const useSimpleGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);

      // Google 로그인
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // ID Token 가져오기 - 구조 수정
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('ID Token을 가져올 수 없습니다');
      }

      // authService를 통해 백엔드로 전송
      await authService.googleLogin(idToken);

      // 메인 화면으로 이동
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : '다시 시도해주세요.';
      Alert.alert('로그인 실패', message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};
