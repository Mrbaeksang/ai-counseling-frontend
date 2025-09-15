import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { CounselorCard } from '@/components/counselor/CounselorCard';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { CounselorGridCard } from '@/components/counselor/CounselorGridCard';
import { CounselorGridCardSkeleton } from '@/components/counselor/CounselorGridCardSkeleton';
import { spacing } from '@/constants/theme';
import type { Counselor } from '@/services/counselors/types';
import type { IconName } from '@/types/icons';

interface CounselorListProps {
  counselors: Counselor[];
  isLoading: boolean;
  isRefreshing: boolean;
  sortBy: 'latest' | 'popular' | 'rating';
  onRefresh: () => void;
  onSortChange: (sort: 'latest' | 'popular' | 'rating') => void;
  onFavoriteToggle: (counselorId: number, isFavorite: boolean) => void;
  ListHeaderComponent?: React.ReactElement;
  viewMode?: 'list' | 'grid';
  onEndReached?: () => void;
  isLoadingMore?: boolean;
}

export const CounselorList = React.memo(
  ({
    counselors,
    isLoading,
    isRefreshing,
    sortBy,
    onRefresh,
    onSortChange,
    onFavoriteToggle,
    ListHeaderComponent,
    viewMode = 'grid',
    onEndReached,
    isLoadingMore = false,
  }: CounselorListProps) => {
    // 정렬 옵션 - useMemo로 최적화
    const sortOptions = useMemo(
      () => [
        { key: 'latest' as const, label: '최신순', icon: 'clock-outline' },
        { key: 'popular' as const, label: '인기순', icon: 'trending-up' },
        { key: 'rating' as const, label: '평점순', icon: 'star' },
      ],
      [],
    );

    const renderCounselor = useCallback(
      ({ item }: { item: Counselor }) => {
        if (viewMode === 'grid') {
          return (
            <View style={styles.gridItem}>
              <CounselorGridCard
                counselor={item}
                onFavoriteToggle={() => onFavoriteToggle(item.id, item.isFavorite)}
              />
            </View>
          );
        }
        return (
          <CounselorCard
            counselor={item}
            isFavorite={item.isFavorite}
            onFavoriteToggle={() => onFavoriteToggle(item.id, item.isFavorite)}
          />
        );
      },
      [onFavoriteToggle, viewMode],
    );

    const renderSkeleton = useCallback(
      ({ index }: { index: number }) => {
        if (viewMode === 'grid') {
          return (
            <View style={styles.gridItem}>
              <CounselorGridCardSkeleton key={`skeleton-${index}`} />
            </View>
          );
        }
        return <CounselorCardSkeleton key={`skeleton-${index}`} />;
      },
      [viewMode],
    );

    const ListHeader = useCallback(
      () => (
        <>
          {ListHeaderComponent}

          {/* 정렬 옵션 */}
          <View style={styles.sortSection}>
            <Text style={styles.sortTitle}>전체 상담사</Text>
            <View style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <AnimatedButton
                  key={option.key}
                  onPress={() => onSortChange(option.key)}
                  style={[styles.sortOption, sortBy === option.key && styles.sortOptionActive]}
                  scaleTo={0.92}
                  springConfig={{ damping: 15, stiffness: 200 }}
                >
                  <MaterialCommunityIcons
                    name={option.icon as IconName}
                    size={16}
                    color={sortBy === option.key ? '#6B46C1' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === option.key && styles.sortOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </AnimatedButton>
              ))}
            </View>
          </View>
        </>
      ),
      [ListHeaderComponent, sortOptions, sortBy, onSortChange],
    );

    const ListEmpty = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-search-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {counselors.length === 0 && isLoading
              ? '상담사를 불러오는 중...'
              : '조건에 맞는 상담사가 없습니다'}
          </Text>
          <Text style={styles.emptyDescription}>
            {counselors.length === 0 && !isLoading && '다른 카테고리를 선택해보세요'}
          </Text>
        </View>
      ),
      [counselors.length, isLoading],
    );

    const ListFooter = useCallback(() => {
      if (!isLoadingMore) return null;

      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#6B46C1" />
          <Text style={styles.loadingText}>더 많은 상담사를 불러오는 중...</Text>
        </View>
      );
    }, [isLoadingMore]);

    return (
      <FlashList
        data={isLoading ? Array(6).fill({}) : counselors}
        renderItem={isLoading ? renderSkeleton : renderCounselor}
        keyExtractor={(item, index) => (isLoading ? `skeleton-${index}` : `counselor-${item.id}`)}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!isLoading ? ListEmpty : null}
        ListFooterComponent={ListFooter}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // 그리드 설정
        numColumns={viewMode === 'grid' ? 3 : 1}
        // FlashList 최적화
        drawDistance={200}
        // @ts-expect-error - FlashList 타입 정의에 estimatedItemSize가 누락됨
        estimatedItemSize={viewMode === 'grid' ? 120 : 140}
        // 무한 스크롤
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
      />
    );
  },
);

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    justifyContent: 'flex-start', // 왼쪽 정렬로 변경
    gap: spacing.sm, // 카드 간 간격
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  gridItem: {
    flex: 1 / 3, // 3열에 맞게 조정
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
  },
  sortOptionActive: {
    backgroundColor: '#EDE9FE',
  },
  sortOptionText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
    color: '#9CA3AF',
  },
  sortOptionTextActive: {
    color: '#6B46C1',
    fontFamily: 'Pretendard-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
    marginTop: spacing.md,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: spacing.xs,
  },
  loadingFooter: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: spacing.xs,
  },
});
