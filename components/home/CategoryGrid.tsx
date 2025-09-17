import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { CATEGORIES } from '@/constants/categories';
import { spacing } from '@/constants/theme';
import { CategoryItem } from './CategoryItem';

interface CategoryGridProps {
  onCategoryPress: (categoryId: string) => void;
  selectedCategories?: Set<string>;
}

export const CategoryGrid = React.memo(
  ({ onCategoryPress, selectedCategories }: CategoryGridProps) => {
    // 선택된 카테고리가 6개 이상의 카테고리에 있으면 자동으로 확장
    const theme = useTheme();
    const hasAdditionalCategorySelected = useMemo(() => {
      if (!selectedCategories || selectedCategories.size === 0) return false;
      const additionalIds = CATEGORIES.slice(6).map((c) => c.id);
      return Array.from(selectedCategories).some((id) => additionalIds.includes(id));
    }, [selectedCategories]);

    const [showAllCategories, setShowAllCategories] = useState(hasAdditionalCategorySelected);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // 메인 카테고리 (처음 6개)와 전체 카테고리 - useMemo로 최적화
    const MAIN_CATEGORIES = useMemo(() => CATEGORIES.slice(0, 6), []);
    const ADDITIONAL_CATEGORIES = useMemo(() => CATEGORIES.slice(6), []);

    // 선택된 카테고리가 추가 카테고리에 있을 때 자동 확장
    useEffect(() => {
      if (hasAdditionalCategorySelected && !showAllCategories) {
        setShowAllCategories(true);
      }
    }, [hasAdditionalCategorySelected, showAllCategories]);

    // 확장/축소 애니메이션 (Animated API만 사용)
    useEffect(() => {
      // Fade 애니메이션
      Animated.timing(fadeAnim, {
        toValue: showAllCategories ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 화살표 회전 애니메이션
      Animated.timing(rotateAnim, {
        toValue: showAllCategories ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [showAllCategories, fadeAnim, rotateAnim]);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            무엇이 가장 힘드신가요?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            고민에 맞는 상담사를 찾아드려요
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          {/* 메인 카테고리 그리드 (6개) */}
          <View style={styles.categoryGrid}>
            {MAIN_CATEGORIES.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onPress={() => onCategoryPress(category.id)}
              />
            ))}
          </View>

          {/* 더보기 버튼 - 전체 너비로 */}
          {!showAllCategories && (
            <AnimatedButton
              style={[
                styles.moreButtonFull,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
              onPress={() => setShowAllCategories(true)}
              scaleTo={0.96}
              springConfig={{ damping: 12, stiffness: 160 }}
            >
              <Text style={[styles.moreButtonText, { color: theme.colors.onSurfaceVariant }]}>
                더 많은 카테고리 보기
              </Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </Animated.View>
            </AnimatedButton>
          )}

          {/* 추가 카테고리 (12개) - 확장 시 표시 */}
          {showAllCategories && (
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
            >
              <View style={styles.categoryGrid}>
                {ADDITIONAL_CATEGORIES.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    onPress={() => onCategoryPress(category.id)}
                  />
                ))}
              </View>

              {/* 접기 버튼 */}
              <AnimatedButton
                style={[styles.collapseButton, { borderColor: theme.colors.outlineVariant }]}
                onPress={() => setShowAllCategories(false)}
                scaleTo={0.94}
                springConfig={{ damping: 15, stiffness: 200 }}
              >
                <Text style={[styles.collapseButtonText, { color: theme.colors.onSurfaceVariant }]}>
                  닫기
                </Text>
                <MaterialCommunityIcons
                  name="chevron-up"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </AnimatedButton>
            </Animated.View>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  categoryContainer: {
    // Container for all category-related elements
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: spacing.md,
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  categoryGradientSelected: {
    transform: [{ scale: 0.95 }],
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#374151',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  moreButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing.xs,
  },
  moreButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  collapseButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    marginRight: 4,
  },
});
