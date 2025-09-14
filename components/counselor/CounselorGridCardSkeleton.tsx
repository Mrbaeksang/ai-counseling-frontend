import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { spacing } from '@/constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export const CounselorGridCardSkeleton = React.memo(() => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        backgroundColor="#F3F4F6"
        highlightColor="#FFFFFF"
        speed={1200}
        borderRadius={12}
      >
        <View style={styles.skeleton}>
          {/* Avatar area */}
          <View style={styles.avatarArea} />
          {/* Name */}
          <View style={styles.nameBar} />
          {/* Philosophy */}
          <View style={styles.philosophyBar} />
        </View>
      </SkeletonPlaceholder>
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
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  avatarArea: {
    width: CARD_WIDTH * 0.6,
    height: CARD_WIDTH * 0.6,
    borderRadius: (CARD_WIDTH * 0.6) / 2,
    marginBottom: spacing.sm,
  },
  nameBar: {
    width: CARD_WIDTH * 0.5,
    height: 14,
    marginBottom: spacing.xs,
  },
  philosophyBar: {
    width: CARD_WIDTH * 0.7,
    height: 10,
  },
});
