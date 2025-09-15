import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { spacing } from '@/constants/theme';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

export const StarRating = React.memo(
  ({ rating, onRatingChange, size = 48, readOnly = false }: StarRatingProps) => {
    const renderStars = () => {
      const stars = [];

      for (let i = 1; i <= 5; i++) {
        const isFullFilled = rating >= i;
        const isHalfFilled = rating === i - 0.5;

        stars.push(
          <View key={i} style={[styles.starWrapper, { width: size, height: size }]}>
            {/* 빈 별 (배경) */}
            <Text style={[styles.starBase, styles.starEmpty, { fontSize: size, lineHeight: size }]}>
              ★
            </Text>

            {/* 채워진 부분 (오버레이) */}
            {!readOnly && (
              <View style={[styles.starOverlay, { width: size, height: size }]}>
                {/* 왼쪽 반개 */}
                <AnimatedButton
                  style={[styles.halfStarTouchLeft, { width: size / 2, height: size }]}
                  onPress={() => onRatingChange(i - 0.5)}
                  scaleTo={0.9}
                  springConfig={{ damping: 20, stiffness: 300 }}
                >
                  {(isHalfFilled || isFullFilled) && (
                    <View style={[styles.halfStarLeftFill, { width: size / 2, height: size }]}>
                      <Text
                        style={[
                          styles.star,
                          styles.starFilled,
                          { fontSize: size, width: size, lineHeight: size },
                        ]}
                      >
                        ★
                      </Text>
                    </View>
                  )}
                </AnimatedButton>

                {/* 오른쪽 반개 */}
                <AnimatedButton
                  style={[styles.halfStarTouchRight, { width: size / 2, height: size }]}
                  onPress={() => onRatingChange(i)}
                  scaleTo={0.9}
                  springConfig={{ damping: 20, stiffness: 300 }}
                >
                  {isFullFilled && (
                    <View style={[styles.halfStarRightFill, { width: size / 2, height: size }]}>
                      <Text
                        style={[
                          styles.star,
                          styles.starFilled,
                          styles.starRightAlign,
                          { fontSize: size, width: size, lineHeight: size, marginLeft: -size / 2 },
                        ]}
                      >
                        ★
                      </Text>
                    </View>
                  )}
                </AnimatedButton>
              </View>
            )}

            {/* Read-only filled stars */}
            {readOnly && (isHalfFilled || isFullFilled) && (
              <View style={[styles.starOverlay, { width: size, height: size }]}>
                {isHalfFilled && (
                  <View style={[styles.halfStarLeftFill, { width: size / 2, height: size }]}>
                    <Text
                      style={[
                        styles.star,
                        styles.starFilled,
                        { fontSize: size, width: size, lineHeight: size },
                      ]}
                    >
                      ★
                    </Text>
                  </View>
                )}
                {isFullFilled && (
                  <View style={[styles.fullStarFill, { width: size, height: size }]}>
                    <Text
                      style={[
                        styles.star,
                        styles.starFilled,
                        { fontSize: size, width: size, lineHeight: size },
                      ]}
                    >
                      ★
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>,
        );
      }

      return stars;
    };

    return <View style={styles.container}>{renderStars()}</View>;
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  starWrapper: {
    position: 'relative',
    marginHorizontal: spacing.xs / 2,
  },
  starBase: {
    position: 'absolute',
    textAlign: 'center',
  },
  starOverlay: {
    position: 'absolute',
    flexDirection: 'row',
  },
  halfStarTouchLeft: {
    // Dynamic styles applied inline
  },
  halfStarTouchRight: {
    // Dynamic styles applied inline
  },
  halfStarLeftFill: {
    position: 'absolute',
    overflow: 'hidden',
  },
  halfStarRightFill: {
    position: 'absolute',
    overflow: 'hidden',
  },
  fullStarFill: {
    position: 'absolute',
  },
  star: {
    textAlign: 'center',
  },
  starRightAlign: {
    // marginLeft applied dynamically
  },
  starEmpty: {
    color: '#E5E7EB',
  },
  starFilled: {
    color: '#F59E0B',
  },
});
