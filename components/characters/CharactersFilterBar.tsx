import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, useTheme } from 'react-native-paper';
import { getCategoryWithEmoji } from '@/constants/categories';
import { spacing } from '@/constants/theme';

interface CharactersFilterBarProps {
  sortBy: 'recent' | 'popular' | 'rating';
  selectedCategories: string[];
  onSortChange: (sort: 'recent' | 'popular' | 'rating') => void;
  onShowFilterModal: () => void;
  onCategoryRemove: (category: string) => void;
  onClearFilters: () => void;
}

export const CharactersFilterBar = React.memo(
  ({
    sortBy,
    selectedCategories,
    onSortChange,
    onShowFilterModal,
    onCategoryRemove,
    onClearFilters,
  }: CharactersFilterBarProps) => {
    const theme = useTheme();
    const hasFilters = selectedCategories.length > 0;

    const handleCategoryRemove = useCallback(
      (category: string) => {
        onCategoryRemove(category);
      },
      [onCategoryRemove],
    );

    return (
      <>
        {/* 정렬 및 필터 */}
        <View style={styles.filterContainer}>
          <View style={styles.filterChips}>
            <Chip
              selected={sortBy === 'recent'}
              onPress={() => onSortChange('recent')}
              showSelectedCheck={false}
              style={{
                backgroundColor:
                  sortBy === 'recent' ? theme.colors.primaryContainer : theme.colors.surface,
              }}
            >
              최신순
            </Chip>
            <Chip
              selected={sortBy === 'popular'}
              onPress={() => onSortChange('popular')}
              showSelectedCheck={false}
              style={{
                backgroundColor:
                  sortBy === 'popular' ? theme.colors.primaryContainer : theme.colors.surface,
              }}
            >
              인기순
            </Chip>
            <Chip
              selected={sortBy === 'rating'}
              onPress={() => onSortChange('rating')}
              showSelectedCheck={false}
              style={{
                backgroundColor:
                  sortBy === 'rating' ? theme.colors.primaryContainer : theme.colors.surface,
              }}
            >
              평점순
            </Chip>
            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: theme.colors.outlineVariant,
                marginHorizontal: spacing.xs,
              }}
            />
            <Chip
              icon={selectedCategories.length > 0 ? undefined : 'filter-variant'}
              selected={selectedCategories.length > 0}
              onPress={onShowFilterModal}
              showSelectedCheck={false}
              style={{
                backgroundColor:
                  selectedCategories.length > 0
                    ? theme.colors.primaryContainer
                    : theme.colors.surface,
                marginRight: 0,
              }}
            >
              {selectedCategories.length > 0 ? `상황별 (${selectedCategories.length})` : '상황별'}
            </Chip>
          </View>
        </View>

        {/* 선택된 필터 칩 */}
        {hasFilters && (
          <View style={[styles.filterContainer, { paddingTop: 0 }]}>
            <View style={styles.filterChips}>
              {selectedCategories.map((category) => (
                <Chip
                  key={category}
                  selected
                  showSelectedCheck={false}
                  onPress={() => handleCategoryRemove(category)}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                  }}
                >
                  {getCategoryWithEmoji(category)}
                </Chip>
              ))}
              <Button mode="text" onPress={onClearFilters} compact>
                전체 초기화
              </Button>
            </View>
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
