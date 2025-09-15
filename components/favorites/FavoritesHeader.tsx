import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export const FavoritesHeader = React.memo(() => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="heart" size={20} color="#EC4899" />
            </View>
            <Text style={styles.title}>즐겨찾기</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
});
