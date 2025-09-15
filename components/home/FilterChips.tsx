import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { CATEGORIES } from '@/constants/categories';
import { spacing } from '@/constants/theme';

interface FilterChipsProps {
  selectedCategories: Set<string>;
  onRemoveCategory: (categoryId: string) => void;
  onClearAll: () => void;
}

export const FilterChips = React.memo(
  ({ selectedCategories, onRemoveCategory, onClearAll }: FilterChipsProps) => {
    // 선택된 카테고리 배열을 메모이제이션
    const selectedCategoryIds = useMemo(() => Array.from(selectedCategories), [selectedCategories]);

    if (selectedCategories.size === 0) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>선택된 필터</Text>
          <AnimatedButton
            onPress={onClearAll}
            style={styles.clearButton}
            scaleTo={0.92}
            springConfig={{ damping: 15, stiffness: 200 }}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color="#6B7280" />
            <Text style={styles.clearText}>전체 해제</Text>
          </AnimatedButton>
        </View>

        <View style={styles.chipsContainer}>
          {selectedCategoryIds.map((categoryId) => {
            const category = CATEGORIES.find((c) => c.id === categoryId);
            if (!category) return null;

            return (
              <Chip
                key={categoryId}
                onClose={() => onRemoveCategory(categoryId)}
                style={[styles.chip, { backgroundColor: `${category.color}20` }]}
                textStyle={[styles.chipText, { color: category.color }]}
                closeIcon={() => (
                  <MaterialCommunityIcons name="close" size={16} color={category.color} />
                )}
              >
                {category.label}
              </Chip>
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
    color: '#6B7280',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    height: 32,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
  },
});
