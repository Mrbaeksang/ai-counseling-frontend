import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { borderRadius, colors, shadows, spacing } from '@/constants/theme';

interface LoadingOverlayProps {
  isVisible: boolean;
  isGoogleLoading: boolean;
}

export const LoadingOverlay = React.memo(({ isVisible, isGoogleLoading }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingCard}>
        <ActivityIndicator
          size="large"
          color={isGoogleLoading ? colors.brand.google : colors.brand.kakao}
        />
        <Text style={styles.loadingText}>로그인 중...</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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
