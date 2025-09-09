import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PremiumButton } from '@/components/common/PremiumButton';
import { borderRadius, shadows, spacing } from '@/constants/theme';
import { useSimpleGoogleAuth } from '@/hooks/useSimpleGoogleAuth';
import useAuthStore from '@/store/authStore';

export default function PremiumLoginScreen() {
  const insets = useSafeAreaInsets();
  const [loading] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { signIn: googleSignIn, isLoading: isGoogleLoading } = useSimpleGoogleAuth();

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

  // OAuth 로그인 처리
  const handleOAuthLogin = async (provider: 'google' | 'kakao') => {
    if (provider === 'google') {
      await googleSignIn();
    } else {
      // 카카오는 추후 구현
      Alert.alert('준비 중', '카카오 로그인은 준비 중입니다.');
    }
  };

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
              {/* 로고 섹션 */}
              <View style={styles.logoSection}>
                <Animated.View
                  style={[
                    styles.logoContainer,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Image
                    source={require('@/assets/icon.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </Animated.View>

                <Text style={styles.appTitle}>Dr. Mind</Text>
                <Text style={styles.appSubtitle}>
                  역사상 가장 위대한 상담가들과 함께{'\n'}
                  지친 마음을 위한 특별한 치유의{'\n'}
                  여정을 시작하세요
                </Text>
              </View>

              {/* 특징 카드 섹션 - 미니멀하게 */}
              <View style={styles.featuresSection}>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color="#374151" />
                  <Text style={styles.featureText}>안전한 공간</Text>
                </View>
                <View style={styles.featureDivider} />
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="heart-outline" size={20} color="#374151" />
                  <Text style={styles.featureText}>깊은 공감</Text>
                </View>
                <View style={styles.featureDivider} />
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="brain" size={20} color="#374151" />
                  <Text style={styles.featureText}>전문적 통찰</Text>
                </View>
              </View>

              {/* 소셜 로그인 섹션 */}
              <View style={styles.loginSection}>
                <View style={styles.buttonContainer}>
                  <PremiumButton
                    onPress={() => handleOAuthLogin('google')}
                    disabled={isGoogleLoading}
                    icon={<MaterialCommunityIcons name="google" size={20} color="#EA4335" />}
                    text="Google로 계속하기"
                    gradientColors={['#FFFFFF', '#FFFFFF']}
                    textColor="#374151"
                  />

                  <PremiumButton
                    onPress={() => handleOAuthLogin('kakao')}
                    disabled={loading}
                    icon={<MaterialCommunityIcons name="chat" size={20} color="#3C1E1E" />}
                    text="카카오로 계속하기"
                    gradientColors={['#FEE500', '#FEE500']}
                    textColor="#3C1E1E"
                  />
                </View>
              </View>

              {/* 하단 문구 */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  계속 진행 시<Text style={styles.footerLink}>서비스 이용약관</Text> 및{'\n'}
                  <Text style={styles.footerLink}>개인정보처리방침</Text>에 동의하게 됩니다
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* 로딩 오버레이 */}
      {isGoogleLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.loadingText}>로그인 중...</Text>
          </View>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl * 1.5,
    borderRadius: borderRadius.xl,
    marginHorizontal: -spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xs,
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.md,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  loginSection: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xl,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#1F2937',
    fontFamily: 'Pretendard-SemiBold',
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.lg,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 14,
    color: '#374151',
    marginTop: spacing.md,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
});
