import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { spacing } from '@/constants/theme';
import type { IconName } from '@/types/icons';

interface CategoryItemProps {
  category: {
    id: string;
    label: string;
    icon: string;
    gradient: readonly [string, string, ...string[]];
  };
  onPress: () => void;
}

export const CategoryItem = React.memo(({ category, onPress }: CategoryItemProps) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, {
      damping: 15,
      stiffness: 200,
    });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  }, [scale]);

  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={1}
    >
      <Reanimated.View style={animatedStyle}>
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <MaterialCommunityIcons name={category.icon as IconName} size={26} color="white" />
        </LinearGradient>
      </Reanimated.View>
      <Text style={[styles.categoryLabel, { color: theme.colors.onSurface }]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  categoryGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
  },
});
