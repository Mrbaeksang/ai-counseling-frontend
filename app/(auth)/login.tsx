import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
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
  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    if (provider === 'google') {
      await googleSignIn();
    } else {
      // 카카오, 네이버는 추후 구현
      Alert.alert(
        '준비 중',
        `${provider === 'kakao' ? '카카오' : '네이버'} 로그인은 준비 중입니다.`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFB', '#F3F4F6']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

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
            {/* 미니멀 로고 섹션 */}
            <View style={styles.logoSection}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <View style={styles.logoCircle}>
                  <MaterialCommunityIcons name="brain" size={60} color="#4285F4" />
                </View>
              </Animated.View>

              <Text style={styles.appTitle}>Dr. Mind</Text>
              <Text style={styles.appSubtitle}>AI 심리 상담 전문가</Text>
            </View>

            {/* 특징 카드 섹션 - 미니멀하게 */}
            <View style={styles.featuresSection}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#6B7280" />
                <Text style={styles.featureText}>24시간</Text>
              </View>
              <View style={styles.featureDivider} />
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#6B7280" />
                <Text style={styles.featureText}>비밀보장</Text>
              </View>
              <View style={styles.featureDivider} />
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="account-heart-outline" size={20} color="#6B7280" />
                <Text style={styles.featureText}>맞춤상담</Text>
              </View>
            </View>

            {/* 소셜 로그인 섹션 */}
            <View style={styles.loginSection}>
              <View style={styles.buttonContainer}>
                <PremiumButton
                  onPress={() => handleOAuthLogin('google')}
                  disabled={isGoogleLoading}
                  icon={<MaterialCommunityIcons name="google" size={20} color="#FFFFFF" />}
                  text="Google로 계속하기"
                  gradientColors={['#4285F4', '#4285F4']}
                />

                <PremiumButton
                  onPress={() => handleOAuthLogin('kakao')}
                  disabled={loading}
                  icon={<MaterialCommunityIcons name="chat" size={20} color="#3C1E1E" />}
                  text="카카오로 계속하기"
                  gradientColors={['#FEE500', '#FEE500']}
                  textColor="#3C1E1E"
                />

                <PremiumButton
                  onPress={() => handleOAuthLogin('naver')}
                  disabled={loading}
                  icon={
                    <View style={styles.naverIconContainer}>
                      <Text style={styles.naverIcon}>N</Text>
                    </View>
                  }
                  text="네이버로 계속하기"
                  gradientColors={['#03C75A', '#03C75A']}
                />
              </View>
            </View>

            {/* 하단 문구 */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                계속 진행 시 서비스 이용약관 및{'\n'}개인정보처리방침에 동의하게 됩니다
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  background: {
    ...StyleSheet.absoluteFillObject,
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
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: spacing.xs,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  loginSection: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  naverIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  naverIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
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
    fontWeight: '500',
  },
});
