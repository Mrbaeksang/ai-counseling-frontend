import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CharacterGridCard } from '@/components/character/CharacterGridCard';
import { CharacterGridCardSkeleton } from '@/components/character/CharacterGridCardSkeleton';
import { CategoryFilterModal } from '@/components/characters/CategoryFilterModal';
import { CharactersFilterBar } from '@/components/characters/CharactersFilterBar';
import { CharactersHeader } from '@/components/characters/CharactersHeader';
import { spacing } from '@/constants/theme';
import { useCharacters, useToggleFavorite } from '@/hooks/useCharacters';
import type { Character } from '@/services/characters/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.md,
    fontFamily: 'Pretendard-Medium',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: 'Pretendard-Regular',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  skeletonItem: {
    width: '31%',
  },
});

export default function CharactersScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const params = useLocalSearchParams<{ selectedCategory?: string }>();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');

  // 홈에서 넘어온 카테고리 파라미터 처리
  useEffect(() => {
    if (params.selectedCategory) {
      setSelectedCategories([params.selectedCategory]);
      // 파라미터 초기화 (다시 들어왔을 때 중복 방지)
      delete params.selectedCategory;
    }
  }, [params.selectedCategory]);

  const { data, isLoading, refetch } = useCharacters(1, 40, sortBy);
  const toggleFavorite = useToggleFavorite();

  // 필터링된 캐릭터 목록
  const filteredCharacters = useMemo(() => {
    if (!data?.content) return [];

    let filtered = [...data.content];

    // 카테고리 필터링
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((character) => {
        if (!character.categories) return false;
        const characterCategories = character.categories
          .split(',')
          .map((cat: string) => cat.trim());
        return characterCategories.some((cat: string) => selectedCategories.includes(cat));
      });
    }

    return filtered;
  }, [data, selectedCategories]);

  const _handleCharacterPress = useCallback((character: Character) => {
    // 새 세션 시작 또는 캐릭터 상세 페이지로 이동
    router.push({
      pathname: '/characters/[id]',
      params: {
        id: character.id,
        name: character.name,
        avatarUrl: character.avatarUrl,
      },
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCategorySelect = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    setShowFilterModal(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const handleCategoryRemove = useCallback((category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  }, []);

  const handleFavoriteToggle = useCallback(
    async (characterId: number) => {
      const character = filteredCharacters.find((c) => c.id === characterId);
      if (character) {
        toggleFavorite.mutate({
          characterId,
          isFavorite: character.isFavorite,
        });
      }
    },
    [filteredCharacters, toggleFavorite],
  );

  const renderCharacter = useCallback(
    ({ item }: { item: Character }) => (
      <CharacterGridCard character={item} onFavoriteToggle={() => handleFavoriteToggle(item.id)} />
    ),
    [handleFavoriteToggle],
  );

  const keyExtractor = useCallback((item: Character) => String(item.id), []);

  if (isLoading && !data) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, paddingTop: insets.top },
        ]}
      >
        <CharactersHeader title="캐릭터" subtitle="AI 상담사를 선택하세요" />

        {/* 캐릭터 그리드 스켈레톤 */}
        <View style={styles.listContent}>
          <View style={[styles.skeletonGrid]}>
            {Array.from({ length: 9 }).map((_, index) => (
              <View key={`character-skeleton-${Date.now()}-${index}`} style={styles.skeletonItem}>
                <CharacterGridCardSkeleton />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <CharactersHeader title="캐릭터" subtitle="AI 상담사를 선택하세요" />

      <CharactersFilterBar
        sortBy={sortBy}
        selectedCategories={selectedCategories}
        onSortChange={setSortBy}
        onShowFilterModal={() => setShowFilterModal(true)}
        onCategoryRemove={handleCategoryRemove}
        onClearFilters={handleClearFilters}
      />

      {/* 캐릭터 리스트 */}
      <FlatList
        data={filteredCharacters}
        renderItem={renderCharacter}
        keyExtractor={keyExtractor}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          filteredCharacters.length === 0 && styles.emptyContainer,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="robot-off"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
              캐릭터를 찾을 수 없습니다
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}>
              {selectedCategories.length > 0
                ? '다른 검색어나 필터를 시도해보세요'
                : '캐릭터를 불러오는 중 오류가 발생했습니다'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* 카테고리 필터 모달 */}
      <Portal>
        <CategoryFilterModal
          visible={showFilterModal}
          onDismiss={() => setShowFilterModal(false)}
          selectedCategories={selectedCategories}
          onSelect={handleCategorySelect}
        />
      </Portal>
    </View>
  );
}
