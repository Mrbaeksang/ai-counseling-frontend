import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PremiumButton } from '@/components/common/PremiumButton';
import { spacing } from '@/constants/theme';

interface OAuthButtonsProps {
  onGoogleSignIn: () => Promise<void>;
  onKakaoSignIn: () => Promise<void>;
  isGoogleLoading: boolean;
  isKakaoLoading: boolean;
}

export const OAuthButtons = React.memo(
  ({ onGoogleSignIn, onKakaoSignIn, isGoogleLoading, isKakaoLoading }: OAuthButtonsProps) => {
    const handleGooglePress = useCallback(() => {
      onGoogleSignIn();
    }, [onGoogleSignIn]);

    const handleKakaoPress = useCallback(() => {
      onKakaoSignIn();
    }, [onKakaoSignIn]);

    return (
      <View style={styles.loginSection}>
        <View style={styles.buttonContainer}>
          <PremiumButton
            onPress={handleGooglePress}
            disabled={isGoogleLoading}
            icon={<MaterialCommunityIcons name="google" size={20} color="#EA4335" />}
            text="Google로 계속하기"
            gradientColors={['#FFFFFF', '#FFFFFF']}
            textColor="#374151"
          />

          <PremiumButton
            onPress={handleKakaoPress}
            disabled={isKakaoLoading}
            icon={<MaterialCommunityIcons name="chat" size={20} color="#3C1E1E" />}
            text="카카오로 계속하기"
            gradientColors={['#FEE500', '#FEE500']}
            textColor="#3C1E1E"
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
