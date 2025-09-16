import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginPromptDialog } from '@/components/common/LoginPromptDialog';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { CounselorList } from '@/components/home/CounselorList';
import { DailyQuote } from '@/components/home/DailyQuote';
import { FilterChips } from '@/components/home/FilterChips';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { useToggleFavorite } from '@/hooks/useCounselors';
import { useInfiniteCounselors } from '@/hooks/useInfiniteCounselors';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/store/toastStore';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { show: _showToast } = useToast();
  const theme = useTheme();

  // 상태 관리
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 정렬 옵션 매핑
  const sortMap: Record<'latest' | 'popular' | 'rating', 'recent' | 'popular' | 'rating'> = {
    latest: 'recent',
    popular: 'popular',
    rating: 'rating',
  };

  // 무한 스크롤 API 호출 훅
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchCounselors,
  } = useInfiniteCounselors(20, sortMap[sortBy]);

  const toggleFavoriteMutation = useToggleFavorite();
  const toggleFavorite = useCallback(
    (counselorId: number, isFavorite: boolean) => {
      toggleFavoriteMutation.mutate({ counselorId, isFavorite });
    },
    [toggleFavoriteMutation],
  );

  // 모든 페이지의 상담사 데이터 합치기
  const allCounselors = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.content || []);
  }, [data]);

  // 상담사 필터링 (useMemo로 최적화)
  const filteredCounselors = useMemo(() => {
    if (selectedCategories.size === 0) return allCounselors;

    return allCounselors.filter((counselor) => {
      if (!counselor.categories) return false;
      const counselorCategories = counselor.categories.split(',').map((cat: string) => cat.trim());
      return counselorCategories.some((cat: string) => selectedCategories.has(cat));
    });
  }, [allCounselors, selectedCategories]);

  // 이벤트 핸들러 (useCallback으로 최적화)
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetchCounselors();
    setIsRefreshing(false);
  }, [refetchCounselors]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleRemoveCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories(new Set());
  }, []);

  const handleFavoriteToggle = useCallback(
    (counselorId: number, isFavorite: boolean) => {
      // 로그인 체크 - 다이얼로그 표시
      if (!user) {
        setShowLoginDialog(true);
        return;
      }
      toggleFavorite(counselorId, isFavorite);
    },
    [toggleFavorite, user],
  );

  // 무한 스크롤 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 헤더 컴포넌트 (useMemo로 최적화)
  const ListHeader = useMemo(
    () => (
      <>
        <WelcomeSection userName={user?.nickname} />
        <DailyQuote />
        <CategoryGrid
          onCategoryPress={handleCategoryPress}
          selectedCategories={selectedCategories}
        />
        <FilterChips
          selectedCategories={selectedCategories}
          onRemoveCategory={handleRemoveCategory}
          onClearAll={handleClearFilters}
        />
      </>
    ),
    [
      user?.nickname,
      selectedCategories,
      handleCategoryPress,
      handleRemoveCategory,
      handleClearFilters,
    ],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <CounselorList
        counselors={filteredCounselors}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        sortBy={sortBy}
        onRefresh={handleRefresh}
        onSortChange={setSortBy}
        onFavoriteToggle={handleFavoriteToggle}
        ListHeaderComponent={ListHeader}
        viewMode="grid"
        onEndReached={handleLoadMore}
        isLoadingMore={isFetchingNextPage}
      />

      {/* 로그인 유도 다이얼로그 */}
      <LoginPromptDialog
        visible={showLoginDialog}
        onDismiss={() => setShowLoginDialog(false)}
        title="즐겨찾기를 사용하려면 로그인이 필요해요"
        description="3초만에 로그인하고\n개인 맞춤 상담을 받아보세요! ✨"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
