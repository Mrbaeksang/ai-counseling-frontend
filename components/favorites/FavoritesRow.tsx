import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { FavoriteCounselorCard } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';

interface FavoritesRowProps {
  data: FavoriteCounselorResponse[];
  isLoading: boolean;
  showScrollHint: boolean;
  scrollHintAnim: Animated.Value;
  onFavoriteToggle: (counselorId: number) => void;
  onScroll: () => void;
  rowKey: string;
  hintColor: string;
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
  }: FavoritesRowProps) => {
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
      [onFavoriteToggle],
    );

    const renderSkeleton = useCallback(
      ({ index }: { index: number }) => (
        <View style={styles.cardContainer}>
          <CounselorCardSkeleton key={`skeleton-${index}`} />
        </View>
      ),
      [],
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
        />

        {/* 오른쪽 페이드 효과 */}
        {data.length > 2 && (
          <LinearGradient
            colors={['transparent', 'rgba(249, 250, 251, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rightFade}
            pointerEvents="none"
          />
        )}

        {/* 스크롤 힌트 애니메이션 */}
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
                      outputRange: [-5, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <MaterialCommunityIcons name="chevron-right" size={32} color={hintColor} />
          </Animated.View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  rowWrapper: {
    height: '50%',
    marginBottom: spacing.sm,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
