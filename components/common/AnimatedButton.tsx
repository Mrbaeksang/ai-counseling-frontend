import React, { type ReactNode, useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type WithSpringConfig,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedButtonProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  springConfig?: WithSpringConfig;
  shouldAnimate?: boolean;
}

export const AnimatedButton = React.memo(
  ({
    children,
    onPress,
    onLongPress,
    disabled = false,
    style,
    scaleTo = 0.96,
    springConfig = { damping: 15, stiffness: 200 },
    shouldAnimate = true,
    ...rest
  }: AnimatedButtonProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handlePressIn = useCallback(() => {
      if (!disabled && shouldAnimate) {
        scale.value = withSpring(scaleTo, springConfig);
        opacity.value = withSpring(0.9, springConfig);
      }
    }, [disabled, shouldAnimate, scaleTo, springConfig, scale, opacity]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, springConfig);
      opacity.value = withSpring(1, springConfig);
    }, [springConfig, scale, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        style={style}
        {...rest}
      >
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Pressable>
    );
  },
);

AnimatedButton.displayName = 'AnimatedButton';
