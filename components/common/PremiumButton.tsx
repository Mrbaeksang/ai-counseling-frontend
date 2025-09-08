import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface PremiumButtonProps {
  onPress: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  text: string;
  gradientColors: readonly [string, string, ...string[]];
  textColor?: string;
}

export const PremiumButton = ({
  onPress,
  disabled,
  icon,
  text,
  gradientColors,
  textColor = '#FFFFFF',
}: PremiumButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
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
};

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
  pressed: {
    opacity: 0.8,
  },
});
