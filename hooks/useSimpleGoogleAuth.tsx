import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import authService from '@/services/authService';

// Google Sign-In 조건부 import (Expo Go에서는 사용 불가)
interface GoogleSignInType {
  configure: (options: { webClientId: string }) => void;
  hasPlayServices: (options?: { showPlayServicesUpdateDialog?: boolean }) => Promise<boolean>;
  signIn: () => Promise<{ data?: { user: { id: string; email: string | null } } }>;
  getTokens: () => Promise<{ idToken: string }>;
}

let GoogleSignin: GoogleSignInType | null = null;
try {
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  // Google OAuth 설정
  if (GoogleSignin) {
    GoogleSignin.configure({
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        '470745173996-ei46dtmudv9j2cph7scqnh9m5sit8ons.apps.googleusercontent.com',
    });
  }
} catch (error: unknown) {
  void error; // 명시적 무시
  // WebBrowser 초기화 실패 무시
}

export const useSimpleGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);

      // Expo Go 환경 체크
      if (!GoogleSignin) {
        if (__DEV__) {
          Alert.alert(
            '개발 모드 알림',
            'Google 로그인은 실제 빌드에서만 작동합니다.\n개발 빌드를 생성하거나 카카오 로그인을 사용해주세요.',
            [{ text: '확인' }],
          );
          return;
        }
        throw new Error('Google Sign-In not available');
      }
      await GoogleSignin.hasPlayServices();
      const _userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      if (!tokens.idToken) {
        throw new Error('ID Token을 가져올 수 없습니다');
      }
      await authService.googleLogin(tokens.idToken);

      // 메인 화면으로 이동
      router.replace('/(tabs)');
    } catch (error) {
      // 에러 타입별 상세 분석
      if (error instanceof Error) {
      }

      const message = error instanceof Error ? error.message : '다시 시도해주세요.';
      Alert.alert('Google 로그인 실패', `${message}\n\n콘솔 로그를 확인해주세요.`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
};
