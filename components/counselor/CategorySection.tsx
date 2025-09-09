import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Surface, Text } from 'react-native-paper';
import { translateCategory } from '@/constants/categories';
import { spacing } from '@/constants/theme';

interface CategorySectionProps {
  categories?: string;
}

export const CategorySection = React.memo(({ categories }: CategorySectionProps) => {
  if (!categories) return null;

  return (
    <Surface style={styles.section}>
      <Text style={styles.sectionTitle}>전문 분야</Text>
      <View style={styles.categoryContainer}>
        {categories.split(',').map((category) => (
          <Chip
            key={category}
            mode="flat"
            style={styles.categoryChip}
            textStyle={styles.categoryChipText}
          >
            {translateCategory(category.trim())}
          </Chip>
        ))}
      </View>
    </Surface>
  );
});

CategorySection.displayName = 'CategorySection';

const styles = StyleSheet.create({
  section: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: spacing.md,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    backgroundColor: '#F3E8FF',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B46C1',
  },
});
