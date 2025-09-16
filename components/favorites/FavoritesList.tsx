import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { type MD3Theme, useTheme } from 'react-native-paper';
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
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const primaryHintColor = theme.colors.primary;
    const secondaryHintColor = theme.colors.secondary;
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

    const handleScrollRow1 = useCallback(
      (event?: { nativeEvent: { contentOffset: { x: number } } }) => {
        setShowScrollHint(false);
        if (event?.nativeEvent) {
          const { contentOffset } = event.nativeEvent;
          const index = Math.round(contentOffset.x / (CARD_WIDTH + spacing.sm));
          setActiveIndex1(Math.max(0, index));
        }
      },
      [],
    );

    const handleScrollRow2 = useCallback(
      (event?: { nativeEvent: { contentOffset: { x: number } } }) => {
        setShowScrollHint(false);
        if (event?.nativeEvent) {
          const { contentOffset } = event.nativeEvent;
          const index = Math.round(contentOffset.x / (CARD_WIDTH + spacing.sm));
          setActiveIndex2(Math.max(0, index));
        }
      },
      [],
    );

    const renderItem = useCallback(
      ({ item }: { item: { key: string; type: 'header' | 'row1' | 'row2' } }) => {
        switch (item.type) {
          case 'header':
            return <FavoritesHeader />;
          case 'row1':
            return (
              <FavoritesRow
                data={firstRow}
                isLoading={isLoading}
                showScrollHint={showScrollHint}
                scrollHintAnim={scrollHintAnim}
                onFavoriteToggle={onFavoriteToggle}
                onScroll={handleScrollRow1}
                rowKey="row1"
                hintColor={primaryHintColor}
                activeIndex={activeIndex1}
              />
            );
          case 'row2':
            return secondRow.length > 0 ? (
              <FavoritesRow
                data={secondRow}
                isLoading={isLoading}
                showScrollHint={showScrollHint}
                scrollHintAnim={scrollHintAnim}
                onFavoriteToggle={onFavoriteToggle}
                onScroll={handleScrollRow2}
                rowKey="row2"
                hintColor={secondaryHintColor}
                activeIndex={activeIndex2}
              />
            ) : null;
          default:
            return null;
        }
      },
      [
        firstRow,
        secondRow,
        isLoading,
        showScrollHint,
        scrollHintAnim,
        onFavoriteToggle,
        handleScrollRow1,
        handleScrollRow2,
        primaryHintColor,
        secondaryHintColor,
        activeIndex1,
        activeIndex2,
      ],
    );

    const listData = useMemo(() => {
      const data: Array<{ key: string; type: 'header' | 'row1' | 'row2' }> = [
        { key: 'header', type: 'header' },
        { key: 'row1', type: 'row1' },
      ];
      if (secondRow.length > 0) {
        data.push({ key: 'row2', type: 'row2' });
      }
      return data;
    }, [secondRow.length]);

    // Early return after all hooks
    if (!isAuthenticated || (favorites.length === 0 && !isLoading)) {
      return (
        <>
          <FavoritesHeader />
          <FavoritesEmptyState isAuthenticated={isAuthenticated} />
        </>
      );
    }

    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
    );
  },
);

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      // flex: 1 제거 - 이것이 헤더를 아래로 밀고 있었음
      // justifyContent: 'center' 제거 - 상단부터 시작하도록
    },
    rowsContainer: {
      paddingVertical: spacing.md,
      gap: spacing.xl, // 1행과 2행 사이 간격 증가
    },
  });
