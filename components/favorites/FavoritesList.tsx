import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { CARD_WIDTH } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';
import { FavoritesEmptyState } from './FavoritesEmptyState';
import { FavoritesHeader } from './FavoritesHeader';
import { FavoritesRow } from './FavoritesRow';

interface FavoritesListProps {
  favorites: FavoriteCounselorResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
  onFavoriteToggle: (counselorId: number) => void;
}

export const FavoritesList = React.memo(
  ({
    favorites,
    isLoading,
    isRefreshing,
    isAuthenticated,
    onRefresh,
    onFavoriteToggle,
  }: FavoritesListProps) => {
    // 스크롤 힌트 애니메이션
    const scrollHintAnim = useRef(new Animated.Value(1)).current;
    const [showScrollHint, setShowScrollHint] = useState(true);

    // Active pagination dots state
    const [activeIndex1, setActiveIndex1] = useState(0);
    const [activeIndex2, setActiveIndex2] = useState(0);

    // 초기 진입시 스크롤 힌트 애니메이션
    useEffect(() => {
      if (favorites.length > 2 && showScrollHint) {
        // 펄스 애니메이션
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollHintAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scrollHintAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();

        // 5초 후 힌트 숨기기
        const timer = setTimeout(() => {
          setShowScrollHint(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }, [favorites.length, showScrollHint, scrollHintAnim]);

    // 즐겨찾기를 2개의 행으로 나누기 (각 행에 더 많은 아이템)
    const [firstRow, secondRow] = useMemo(() => {
      if (isLoading) {
        return [Array(6).fill({}), Array(6).fill({})];
      }
      // 홀수 인덱스는 첫 번째 행, 짝수 인덱스는 두 번째 행
      const row1: FavoriteCounselorResponse[] = [];
      const row2: FavoriteCounselorResponse[] = [];
      favorites.forEach((item, index) => {
        if (index % 2 === 0) {
          row1.push(item);
        } else {
          row2.push(item);
        }
      });
      return [row1, row2];
    }, [favorites, isLoading]);

    const handleScrollRow1 = (event?: { nativeEvent: { contentOffset: { x: number } } }) => {
      setShowScrollHint(false);
      if (event?.nativeEvent) {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / (CARD_WIDTH + spacing.sm));
        setActiveIndex1(Math.max(0, index));
      }
    };

    const handleScrollRow2 = (event?: { nativeEvent: { contentOffset: { x: number } } }) => {
      setShowScrollHint(false);
      if (event?.nativeEvent) {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / (CARD_WIDTH + spacing.sm));
        setActiveIndex2(Math.max(0, index));
      }
    };

    if (!isAuthenticated || (favorites.length === 0 && !isLoading)) {
      return (
        <>
          <FavoritesHeader />
          <FavoritesEmptyState isAuthenticated={isAuthenticated} />
        </>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.contentContainer}
      >
        <FavoritesHeader />

        <View style={styles.rowsContainer}>
          <FavoritesRow
            data={firstRow}
            isLoading={isLoading}
            showScrollHint={showScrollHint}
            scrollHintAnim={scrollHintAnim}
            onFavoriteToggle={onFavoriteToggle}
            onScroll={handleScrollRow1}
            rowKey="row1"
            hintColor="#6B46C1"
            activeIndex={activeIndex1}
          />

          {secondRow.length > 0 && (
            <FavoritesRow
              data={secondRow}
              isLoading={isLoading}
              showScrollHint={showScrollHint}
              scrollHintAnim={scrollHintAnim}
              onFavoriteToggle={onFavoriteToggle}
              onScroll={handleScrollRow2}
              rowKey="row2"
              hintColor="#EC4899"
              activeIndex={activeIndex2}
            />
          )}
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rowsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg, // 1행과 2행 사이 충분한 여백 (24px)
  },
});
