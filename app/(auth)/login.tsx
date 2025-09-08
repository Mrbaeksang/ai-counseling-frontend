import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Surface, Text, useTheme } from 'react-native-paper';
import authService from '@/services/authService';
import useAuthStore from '@/store/authStore';

// 웹 브라우저 세션 완료 처리
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Google OAuth 설정
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Platform.select({
      ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    }),
  });

  // 이미 로그인되어 있으면 메인으로
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Google 로그인 응답 처리
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleLogin(id_token);
    }
  }, [response]);

  // Google 로그인 처리
  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      await authService.googleLogin(idToken);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('로그인 실패', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Kakao 로그인 처리
  const handleKakaoLogin = async () => {
    Alert.alert('준비 중', '카카오 로그인은 준비 중입니다.\nGoogle 로그인을 이용해주세요.');
    // TODO: Kakao SDK 연동
  };

  // Naver 로그인 처리
  const handleNaverLogin = async () => {
    Alert.alert('준비 중', '네이버 로그인은 준비 중입니다.\nGoogle 로그인을 이용해주세요.');
    // TODO: Naver SDK 연동
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={0}>
          {/* 로고/타이틀 영역 */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="head-heart-outline"
              size={100}
              color={theme.colors.primary}
            />
            <Text variant="headlineLarge" style={styles.title}>
              마음친구
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              AI 철학자와 함께하는 마음 상담
            </Text>
          </View>

          {/* 설명 텍스트 */}
          <View style={styles.description}>
            <Text variant="bodyMedium" style={styles.descriptionText}>
              소크라테스, 공자, 부처님 등{'\n'}
              위대한 철학자들이 당신의 고민을 들어드립니다
            </Text>
          </View>

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialButtons}>
            <Button
              mode="contained"
              onPress={() => promptAsync()}
              disabled={!request || loading}
              style={[styles.socialButton, styles.googleButton]}
              contentStyle={styles.buttonContent}
              icon={() => <MaterialCommunityIcons name="google" size={24} color="#FFFFFF" />}
            >
              Google로 시작하기
            </Button>

            <Button
              mode="contained"
              onPress={handleKakaoLogin}
              disabled={loading}
              style={[styles.socialButton, styles.kakaoButton]}
              contentStyle={styles.buttonContent}
              icon={() => <MaterialCommunityIcons name="chat" size={24} color="#3C1E1E" />}
              textColor="#3C1E1E"
            >
              카카오로 시작하기
            </Button>

            <Button
              mode="contained"
              onPress={handleNaverLogin}
              disabled={loading}
              style={[styles.socialButton, styles.naverButton]}
              contentStyle={styles.buttonContent}
              icon={() => <Text style={styles.naverIcon}>N</Text>}
            >
              네이버로 시작하기
            </Button>
          </View>

          {/* 안내 문구 */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              소셜 계정으로 간편하게 시작하세요
            </Text>
            <Text variant="bodySmall" style={[styles.footerText, { marginTop: 4 }]}>
              별도의 회원가입이 필요없습니다
            </Text>
          </View>
        </Surface>
      </ScrollView>

      {/* 전체 로딩 오버레이 */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  surface: {
    flex: 1,
    padding: 24,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  subtitle: {
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
  description: {
    alignItems: 'center',
    marginBottom: 48,
  },
  descriptionText: {
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
  },
  socialButtons: {
    marginBottom: 32,
  },
  socialButton: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  naverIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
