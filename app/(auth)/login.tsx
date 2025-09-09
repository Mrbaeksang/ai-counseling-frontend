import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeatureSection } from '@/components/auth/FeatureSection';
import { FooterSection } from '@/components/auth/FooterSection';
import { LoadingOverlay } from '@/components/auth/LoadingOverlay';
import { LogoSection } from '@/components/auth/LogoSection';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { spacing } from '@/constants/theme';
import { useKakaoAuth } from '@/hooks/useKakaoAuth';
import { useSimpleGoogleAuth } from '@/hooks/useSimpleGoogleAuth';
import useAuthStore from '@/store/authStore';

export default function PremiumLoginScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  const { signIn: googleSignIn, isLoading: isGoogleLoading } = useSimpleGoogleAuth();
  const { signIn: kakaoSignIn, isLoading: isKakaoLoading } = useKakaoAuth();

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 진입 애니메이션
  useEffect(() => {
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
  }, [fadeAnim, slideAnim, pulseAnim]);

  // 이미 로그인되어 있으면 메인으로
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // OAuth 로그인 핸들러
  const handleGoogleSignIn = useCallback(async () => {
    await googleSignIn();
  }, [googleSignIn]);

  const handleKakaoSignIn = useCallback(async () => {
    await kakaoSignIn();
  }, [kakaoSignIn]);

  return (
    <View style={styles.container}>
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
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
            ]}
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
        isVisible={isGoogleLoading || isKakaoLoading}
        isGoogleLoading={isGoogleLoading}
      />
    </View>
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
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
});
