import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { CounselorList } from '@/components/home/CounselorList';
import { FilterChips } from '@/components/home/FilterChips';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { useCounselors, useFavoriteCounselors, useToggleFavorite } from '@/hooks/useCounselors';
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

  const { data: favoritesData, refetch: refetchFavorites } = useFavoriteCounselors(1, 10);

  const { toggle: toggleFavorite } = useToggleFavorite();

  // 상담사 필터링
  const allCounselors = counselorsData?.content || [];
  const filteredCounselors =
    selectedCategories.size > 0
      ? allCounselors.filter((counselor) => {
          if (!counselor.categories) return false;
          const counselorCategories = counselor.categories.split(',').map((cat) => cat.trim());
          return counselorCategories.some((cat) => selectedCategories.has(cat));
        })
      : allCounselors;

  // 즐겨찾기 데이터
  const favoriteCounselors = favoritesData?.content || [];
  const favoriteIds = new Set(favoriteCounselors.map((c) => c.id));

  // 이벤트 핸들러
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchCounselors(), refetchFavorites()]);
    setIsRefreshing(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(categoryId);
      return newSet;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set());
  };

  const handleFavoriteToggle = (counselorId: number, isFavorite: boolean) => {
    toggleFavorite(counselorId, isFavorite);
  };

  // 헤더 컴포넌트
  const ListHeader = (
    <>
      <WelcomeSection userName={user?.nickname} />
      <CategoryGrid selectedCategories={selectedCategories} onCategoryPress={handleCategoryPress} />
      <FilterChips
        selectedCategories={selectedCategories}
        onRemoveCategory={handleRemoveCategory}
        onClearAll={handleClearFilters}
      />
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CounselorList
        counselors={filteredCounselors}
        favoriteCounselors={favoriteCounselors}
        favoriteIds={favoriteIds}
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
