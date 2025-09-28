import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { CATEGORIES } from '@/constants/categories';
import { spacing } from '@/constants/theme';

// 백엔드 카테고리 ID 배열 (InitDataConfig.kt와 일치)
const CATEGORY_IDS = CATEGORIES.map((category) => category.id);

interface CategoryFilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  selectedCategories: string[];
  onSelect: (categories: string[]) => void;
}

export const CategoryFilterModal = React.memo(
  ({ visible, onDismiss, selectedCategories, onSelect }: CategoryFilterModalProps) => {
    const theme = useTheme();
    const [tempSelected, setTempSelected] = useState<string[]>(selectedCategories);

    React.useEffect(() => {
      if (visible) {
        setTempSelected(selectedCategories);
      }
    }, [visible, selectedCategories]);

    const handleToggleCategory = useCallback((category: string) => {
      setTempSelected((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
      );
    }, []);

    const handleSelectAll = useCallback(() => {
      setTempSelected(CATEGORY_IDS);
    }, []);

    const handleClearAll = useCallback(() => {
      setTempSelected([]);
    }, []);

    const handleApply = useCallback(() => {
      onSelect(tempSelected);
      onDismiss();
    }, [tempSelected, onSelect, onDismiss]);

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
        >
          <View style={{ flex: 1, maxHeight: '100%' }}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>카테고리 필터</Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                원하는 카테고리를 선택하세요 (중복 선택 가능)
              </Text>
            </View>

            <View style={styles.quickActions}>
              <Button
                mode="text"
                onPress={handleSelectAll}
                compact
                disabled={tempSelected.length === CATEGORY_IDS.length}
              >
                전체 선택
              </Button>
              <Button
                mode="text"
                onPress={handleClearAll}
                compact
                disabled={tempSelected.length === 0}
              >
                전체 해제
              </Button>
            </View>

            <ScrollView
              style={styles.categoryList}
              contentContainerStyle={{ paddingBottom: spacing.lg }}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: tempSelected.includes(category.id)
                          ? `${category.color}20` // 20% opacity
                          : theme.colors.surface,
                        borderColor: tempSelected.includes(category.id)
                          ? category.color
                          : theme.colors.outlineVariant,
                        borderWidth: tempSelected.includes(category.id) ? 2 : 1,
                      },
                    ]}
                    onPress={() => handleToggleCategory(category.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: `${category.color}15`, // 15% opacity
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={category.icon}
                        size={20}
                        color={category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryCardText,
                        {
                          color: tempSelected.includes(category.id)
                            ? category.color
                            : theme.colors.onSurface,
                          fontFamily: tempSelected.includes(category.id)
                            ? 'Pretendard-SemiBold'
                            : 'Pretendard-Regular',
                        },
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button mode="outlined" onPress={onDismiss} style={styles.button}>
                취소
              </Button>
              <Button
                mode="contained"
                onPress={handleApply}
                style={styles.button}
                disabled={tempSelected.length === 0}
              >
                적용 ({tempSelected.length})
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  modalContent: {
    margin: spacing.xl,
    borderRadius: 16,
    maxHeight: '90%',
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  categoryList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    marginBottom: spacing.xs,
  },
  categoryCardText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  button: {
    minWidth: 80,
  },
});
