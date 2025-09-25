import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Surface, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export const CharacterGridCardSkeleton = React.memo(() => {
  const theme = useTheme();

  return (
    <Surface style={styles.container}>
      <View style={styles.skeleton}>
        <View style={[styles.avatarArea, { backgroundColor: theme.colors.surfaceVariant }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
        <View style={[styles.nameBar, { backgroundColor: theme.colors.surfaceVariant }]} />
        <View style={[styles.philosophyBar, { backgroundColor: theme.colors.surfaceVariant }]} />
      </View>
    </Surface>
  );
});

CharacterGridCardSkeleton.displayName = 'CharacterGridCardSkeleton';

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  skeleton: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  avatarArea: {
    width: CARD_WIDTH * 0.6,
    height: CARD_WIDTH * 0.6,
    borderRadius: (CARD_WIDTH * 0.6) / 2,
    marginBottom: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBar: {
    width: CARD_WIDTH * 0.5,
    height: 14,
    marginBottom: spacing.xs,
    borderRadius: 4,
  },
  philosophyBar: {
    width: CARD_WIDTH * 0.7,
    height: 10,
    borderRadius: 4,
  },
});
