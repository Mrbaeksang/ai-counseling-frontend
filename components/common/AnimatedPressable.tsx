import React, { type ReactNode, useCallback } from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  type WithSpringConfig,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  springConfig?: WithSpringConfig;
  shouldAnimate?: boolean;
}

export const AnimatedPressable = React.memo(
  ({
    children,
    onPress,
    onLongPress,
    disabled = false,
    style,
    scaleTo = 0.95,
    springConfig = { damping: 10, stiffness: 150 },
    shouldAnimate = true,
  }: AnimatedPressableProps) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handlePressIn = useCallback(() => {
      if (!disabled && shouldAnimate) {
        scale.value = withSpring(scaleTo, springConfig);
        opacity.value = withSpring(0.8, springConfig);
      }
    }, [disabled, shouldAnimate, scaleTo, springConfig, scale, opacity]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, springConfig);
      opacity.value = withSpring(1, springConfig);
    }, [springConfig, scale, opacity]);

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (!disabled && onPress) {
          onPress(event);
        }
      },
      [disabled, onPress],
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const tapGesture = Gesture.Tap()
      .enabled(!disabled)
      .onBegin(() => {
        runOnJS(handlePressIn)();
      })
      .onFinalize(() => {
        runOnJS(handlePressOut)();
      })
      .onEnd(() => {
        if (onPress) {
          runOnJS(handlePress)({} as GestureResponderEvent);
        }
      });

    const longPressGesture = Gesture.LongPress()
      .enabled(!disabled && !!onLongPress)
      .minDuration(500)
      .onEnd(() => {
        if (onLongPress) {
          runOnJS(onLongPress)();
        }
      });

    const composedGesture = Gesture.Simultaneous(tapGesture, longPressGesture);

    return (
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[animatedStyle, style]} pointerEvents={disabled ? 'none' : 'auto'}>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  },
);

AnimatedPressable.displayName = 'AnimatedPressable';
