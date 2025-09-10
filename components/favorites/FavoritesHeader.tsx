import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export const FavoritesHeader = React.memo(() => {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FAF5FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Text style={styles.title}>✨ 즐겨찾기</Text>
        <Text style={styles.subtitle}>자주 상담받는 철학자들을 모아보세요</Text>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
    marginBottom: spacing.xs,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
});
