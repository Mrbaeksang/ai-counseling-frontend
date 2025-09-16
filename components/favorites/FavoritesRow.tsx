import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { type MD3Theme, useTheme } from 'react-native-paper';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { CARD_WIDTH, FavoriteCounselorCard } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';

const { height: screenHeight } = Dimensions.get('window');
const availableHeight = screenHeight - 180;
const MAX_ROW_HEIGHT = Math.max(
  CARD_WIDTH * 1.5,
  Math.min(availableHeight * 0.48, CARD_WIDTH * 1.8),
);

interface FavoritesRowProps {
  data: FavoriteCounselorResponse[];
  isLoading: boolean;
  showScrollHint: boolean;
  scrollHintAnim: Animated.Value;
  onFavoriteToggle: (counselorId: number) => void;
  onScroll: (event?: { nativeEvent: { contentOffset: { x: number } } }) => void;
  rowKey: string;
  hintColor: string;
  activeIndex: number;
}

export const FavoritesRow = React.memo(
  ({
    data,
    isLoading,
    showScrollHint,
    scrollHintAnim,
    onFavoriteToggle,
    onScroll,
    rowKey,
    hintColor,
    activeIndex,
  }: FavoritesRowProps) => {
    const theme = useTheme();
    const fadeOverlay = `${theme.colors.surface}E6`;
    const hintOverlay = `${theme.colors.surface}CC`;
    const styles = useMemo(() => createStyles(theme, hintOverlay), [theme, hintOverlay]);
    const listRef = useRef<FlatList>(null);

    const renderCounselor = useCallback(
      ({ item }: { item: FavoriteCounselorResponse }) => (
        <View style={styles.cardContainer}>
          <FavoriteCounselorCard
            counselor={item}
            onFavoriteToggle={() => onFavoriteToggle(item.id)}
          />
        </View>
      ),
      [onFavoriteToggle, styles.cardContainer],
    );

    const renderSkeleton = useCallback(
      ({ index }: { index: number }) => (
        <View style={styles.cardContainer}>
          <CounselorCardSkeleton key={`skeleton-${index}`} />
        </View>
      ),
      [styles.cardContainer],
    );

    return (
      <View style={styles.rowWrapper}>
        <FlatList
          ref={listRef}
          horizontal
          data={data}
          renderItem={isLoading ? renderSkeleton : renderCounselor}
          keyExtractor={(item, index) =>
            isLoading ? `skeleton-${rowKey}-${index}` : `favorite-${rowKey}-${item.id}`
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
          scrollEnabled={data.length > 2}
          initialNumToRender={6}
          windowSize={10}
          removeClippedSubviews={false}
        />

        {data.length > 2 && (
          <LinearGradient
            colors={['transparent', fadeOverlay]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightFade}
            pointerEvents="none"
          />
        )}

        {showScrollHint && data.length > 2 && (
          <Animated.View
            style={[
              styles.scrollHint,
              {
                opacity: scrollHintAnim,
                transform: [
                  {
                    translateX: scrollHintAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [-8, 3],
                    }),
                  },
                  {
                    scale: scrollHintAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <MaterialCommunityIcons name="chevron-double-right" size={24} color={hintColor} />
          </Animated.View>
        )}

        {data.length > 2 && (
          <View style={styles.scrollIndicator}>
            {Array.from({ length: Math.ceil(data.length / 2) }).map((_, index) => {
              const dotId = `${rowKey}-page-${index + 1}`;
              return (
                <View
                  key={dotId}
                  style={[
                    styles.scrollDot,
                    {
                      backgroundColor: index === activeIndex ? hintColor : `${hintColor}30`,
                      transform: [{ scale: index === activeIndex ? 1.2 : 1 }],
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  },
);

const createStyles = (theme: MD3Theme, hintOverlay: string) =>
  StyleSheet.create({
    rowWrapper: {
      height: MAX_ROW_HEIGHT,
      position: 'relative',
    },
    rowContent: {
      paddingLeft: spacing.lg,
      paddingRight: spacing.sm,
      alignItems: 'center',
    },
    cardContainer: {
      marginRight: spacing.sm,
    },
    rightFade: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 40,
      zIndex: 1,
    },
    scrollHint: {
      position: 'absolute',
      right: 16,
      top: '50%',
      marginTop: -16,
      zIndex: 2,
      backgroundColor: hintOverlay,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    scrollIndicator: {
      position: 'absolute',
      bottom: 12,
      right: 20,
      flexDirection: 'row',
      gap: 4,
      zIndex: 1,
    },
    scrollDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
    },
  });
