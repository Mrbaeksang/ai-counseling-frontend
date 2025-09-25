import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type MD3Theme, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface SessionTabsProps {
  tabIndex: string;
  onTabChange: (index: string) => void;
}

export const SessionTabs = React.memo(({ tabIndex, onTabChange }: SessionTabsProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const inactiveChipIconColor = theme.colors.onSurfaceVariant;
  const activeChipIconColor = theme.colors.onPrimary;

  return (
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="clipboard-text-multiple"
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View>
          <Text style={styles.title}>대화내역</Text>
          <Text style={styles.subtitle}>최근 대화 기록을 확인하세요</Text>
        </View>
      </View>

      <View style={styles.chipsWrapper}>
        <View style={styles.chipsContainer}>
          <Pressable
            style={[styles.chip, tabIndex === '0' && styles.chipActive]}
            onPress={() => onTabChange('0')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="chat-processing"
              size={14}
              color={tabIndex === '0' ? activeChipIconColor : inactiveChipIconColor}
            />
            <Text style={[styles.chipText, tabIndex === '0' && styles.chipTextActive]}>진행중</Text>
          </Pressable>

          <Pressable
            style={[styles.chip, tabIndex === '1' && styles.chipActive]}
            onPress={() => onTabChange('1')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={14}
              color={tabIndex === '1' ? activeChipIconColor : inactiveChipIconColor}
            />
            <Text style={[styles.chipText, tabIndex === '1' && styles.chipTextActive]}>종료됨</Text>
          </Pressable>

          <Pressable
            style={[styles.chip, tabIndex === '2' && styles.chipActive]}
            onPress={() => onTabChange('2')}
            accessibilityRole="tab"
          >
            <MaterialCommunityIcons
              name="star"
              size={14}
              color={tabIndex === '2' ? activeChipIconColor : inactiveChipIconColor}
            />
            <Text style={[styles.chipText, tabIndex === '2' && styles.chipTextActive]}>북마크</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    titleSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'Pretendard-Bold',
      color: theme.colors.onSurface,
    },
    subtitle: {
      fontSize: 13,
      fontFamily: 'Pretendard-Regular',
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    chipsWrapper: {
      marginLeft: -spacing.sm,
    },
    chipsContainer: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 16,
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    chipText: {
      fontSize: 13,
      fontFamily: 'Pretendard-Medium',
      color: theme.colors.onSurfaceVariant,
    },
    chipTextActive: {
      color: theme.colors.onPrimary,
    },
  });
