import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatureSection } from '@/components/auth/FeatureSection';
import { FooterSection } from '@/components/auth/FooterSection';
import { LoadingOverlay } from '@/components/auth/LoadingOverlay';
import { LogoSection } from '@/components/auth/LogoSection';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { colors, spacing } from '@/constants/theme';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import { useSimpleGoogleAuth } from '@/hooks/useSimpleGoogleAuth';
import useAuthStore from '@/store/authStore';
import useOnboardingStore from '@/store/onboardingStore';

export default function PremiumLoginScreen() {
  const { isAuthenticated } = useAuthStore();
  const { hasSeenOnboarding, completeOnboarding } = useOnboardingStore();
  const { signIn: googleSignIn, isLoading: isGoogleLoading } = useSimpleGoogleAuth();
  const { signIn: kakaoSignIn, isLoading: isKakaoLoading } = useKakaoAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const activeLogin = useMemo<'google' | 'kakao' | null>(() => {
    if (isGoogleLoading) return 'google';
    if (isKakaoLoading) return 'kakao';
    return null;
  }, [isGoogleLoading, isKakaoLoading]);

  const { spinnerColor, spinnerMessage } = useMemo(() => {
    switch (activeLogin) {
      case 'google':
        return {
          spinnerColor: colors.brand.google,
          spinnerMessage: 'Google 계정으로 로그인 중...',
        };
      case 'kakao':
        return {
          spinnerColor: colors.brand.kakao,
          spinnerMessage: '카카오 계정으로 로그인 중...',
        };
      default:
        return {
          spinnerColor: colors.brand.google,
          spinnerMessage: '로그인 중...',
        };
    }
  }, [activeLogin]);

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 온보딩 체크
  useEffect(() => {
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, [hasSeenOnboarding]);

  // 진입 애니메이션
  useEffect(() => {
    // 온보딩이 보이지 않을 때만 애니메이션 실행
    if (!showOnboarding) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // 펄스 애니메이션
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [fadeAnim, slideAnim, pulseAnim, showOnboarding]);

  // 이미 로그인되어 있으면 메인으로
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // OAuth 로그인 핸들러
  const handleGoogleSignIn = useCallback(async () => {
    try {
      await googleSignIn();
    } catch {
      Alert.alert('로그인 실패', 'Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [googleSignIn]);

  const handleKakaoSignIn = useCallback(async () => {
    try {
      await kakaoSignIn();
    } catch {
      Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [kakaoSignIn]);

  const handleOnboardingComplete = useCallback(async () => {
    await completeOnboarding();
    setShowOnboarding(false);
    // 로그인 화면 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [completeOnboarding, fadeAnim, slideAnim]);

  // 온보딩 표시
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('@/assets/images/login-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LogoSection pulseAnim={pulseAnim} />
              <FeatureSection />
              <OAuthButtons
                onGoogleSignIn={handleGoogleSignIn}
                onKakaoSignIn={handleKakaoSignIn}
                isGoogleLoading={isGoogleLoading}
                isKakaoLoading={isKakaoLoading}
              />

              <FooterSection />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <LoadingOverlay
        isVisible={activeLogin !== null}
        spinnerColor={spinnerColor}
        message={spinnerMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
});
