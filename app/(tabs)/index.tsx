import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { CounselorList } from '@/components/home/CounselorList';
import { FilterChips } from '@/components/home/FilterChips';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { useCounselors, useToggleFavorite } from '@/hooks/useCounselors';
import useAuthStore from '@/store/authStore';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  // 상태 관리
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 정렬 옵션 매핑
  const sortMap = {
    latest: 'recent',
    popular: 'popular',
    rating: 'rating',
  };

  // API 호출 훅
  const {
    data: counselorsData,
    isLoading,
    refetch: refetchCounselors,
  } = useCounselors(1, 20, sortMap[sortBy]);

  const toggleFavoriteMutation = useToggleFavorite();
  const toggleFavorite = useCallback(
    (counselorId: number, isFavorite: boolean) => {
      toggleFavoriteMutation.mutate({ counselorId, isFavorite });
    },
    [toggleFavoriteMutation],
  );

  // 상담사 필터링 (useMemo로 최적화)
  const allCounselors = counselorsData?.content || [];
  const filteredCounselors = useMemo(() => {
    if (selectedCategories.size === 0) return allCounselors;

    return allCounselors.filter((counselor) => {
      if (!counselor.categories) return false;
      const counselorCategories = counselor.categories.split(',').map((cat) => cat.trim());
      return counselorCategories.some((cat) => selectedCategories.has(cat));
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
      toggleFavorite(counselorId, isFavorite);
    },
    [toggleFavorite],
  );

  // 헤더 컴포넌트 (useMemo로 최적화)
  const ListHeader = useMemo(
    () => (
      <>
        <WelcomeSection userName={user?.nickname} />
        <CategoryGrid
          selectedCategories={selectedCategories}
          onCategoryPress={handleCategoryPress}
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CounselorList
        counselors={filteredCounselors}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        sortBy={sortBy}
        onRefresh={handleRefresh}
        onSortChange={setSortBy}
        onFavoriteToggle={handleFavoriteToggle}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
