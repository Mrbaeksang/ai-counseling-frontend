import * as KakaoLogin from '@react-native-seoul/kakao-login';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import authService from '@/services/authService';

export const useKakaoAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);

      // Expo Go에서는 카카오 SDK 사용 불가 - 개발 모드 체크
      let token: { accessToken?: string } | undefined;
      try {
        // 카카오 로그인 시도
        token = await KakaoLogin.login();
      } catch (error) {
        // Expo Go 환경에서 실행 중일 때
        if (__DEV__) {
          Alert.alert(
            '개발 모드 알림',
            '카카오 로그인은 실제 빌드에서만 작동합니다.\n개발 빌드를 생성하거나 구글 로그인을 사용해주세요.',
            [{ text: '확인' }],
          );
          return;
        }
        throw error;
      }
      if (!token?.accessToken) {
        throw new Error('카카오 로그인에 실패했습니다');
      }
      // 백엔드로 액세스 토큰 전송
      // 백엔드에서 카카오 사용자 정보 조회 후 JWT 발급
      await authService.kakaoLogin(token.accessToken);
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
