import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export const CounselorGridCardSkeleton = React.memo(() => {
  return (
    <View style={styles.container}>
      <View style={styles.skeleton}>
        <View style={styles.shimmer} />
      </View>
    </View>
  );
});

CounselorGridCardSkeleton.displayName = 'CounselorGridCardSkeleton';

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.sm,
  },
  skeleton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
});
