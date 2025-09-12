import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { spacing } from '@/constants/theme';

interface PremiumButtonProps {
  onPress: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  text: string;
  gradientColors: readonly [string, string, ...string[]];
  textColor?: string;
}

export const PremiumButton = React.memo(
  ({
    onPress,
    disabled,
    icon,
    text,
    gradientColors,
    textColor = '#FFFFFF',
  }: PremiumButtonProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handlePressIn = useCallback(() => {
      if (!disabled) {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
        opacity.value = withSpring(0.85, { damping: 15, stiffness: 200 });
      }
    }, [disabled, scale, opacity]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, [scale, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.container}
      >
        <Animated.View style={[styles.animatedView, animatedStyle]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              {icon}
              <Text style={[styles.text, { color: textColor }]}>{text}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  animatedView: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    marginLeft: spacing.sm,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -0.3,
  },
});
