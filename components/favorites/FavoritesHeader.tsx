import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export const FavoritesHeader = React.memo(() => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <View
              style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}
            >
              <MaterialCommunityIcons name="heart" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>즐겨찾기</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: 'transparent',
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'transparent',
    width: '100%',
  },
});
