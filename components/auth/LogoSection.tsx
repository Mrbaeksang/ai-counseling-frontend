import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing } from '@/constants/theme';

interface LogoSectionProps {
  pulseAnim: Animated.Value;
}

export const LogoSection = React.memo(({ pulseAnim }: LogoSectionProps) => {
  return (
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
        역사상 가장 위대한 대화가들과 함께{'\n'}
        지친 마음을 위한 특별한 치유의{'\n'}
        여정을 시작하세요
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
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
});
