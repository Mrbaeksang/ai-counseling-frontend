import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PremiumButton } from '@/components/common/PremiumButton';
import { colors, spacing } from '@/constants/theme';

interface OAuthButtonsProps {
  onGoogleSignIn: () => Promise<void>;
  onKakaoSignIn: () => Promise<void>;
  isGoogleLoading: boolean;
  isKakaoLoading: boolean;
}

export const OAuthButtons = React.memo(
  ({ onGoogleSignIn, onKakaoSignIn, isGoogleLoading, isKakaoLoading }: OAuthButtonsProps) => {
    return (
      <View style={styles.loginSection}>
        <View style={styles.buttonContainer}>
          <PremiumButton
            onPress={onGoogleSignIn}
            disabled={isGoogleLoading}
            icon={<MaterialCommunityIcons name="google" size={20} color={colors.brand.googleRed} />}
            text="Google로 계속하기"
            gradientColors={[colors.neutral[0], colors.neutral[0]]}
            textColor={colors.neutral[700]}
          />

          <PremiumButton
            onPress={onKakaoSignIn}
            disabled={isKakaoLoading}
            icon={<MaterialCommunityIcons name="chat" size={20} color={colors.brand.kakaoText} />}
            text="카카오로 계속하기"
            gradientColors={[colors.brand.kakao, colors.brand.kakao]}
            textColor={colors.brand.kakaoText}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  loginSection: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
});
