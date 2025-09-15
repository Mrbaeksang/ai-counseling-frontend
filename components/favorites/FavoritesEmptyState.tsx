import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { spacing } from '@/constants/theme';

interface FavoritesEmptyStateProps {
  isAuthenticated: boolean;
}

export const FavoritesEmptyState = React.memo(({ isAuthenticated }: FavoritesEmptyStateProps) => {
  const handleStartChat = useCallback(() => {
    router.push('/(tabs)/');
  }, []);

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="heart-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>
        {!isAuthenticated ? '로그인이 필요합니다' : '아직 즐겨찾기한 상담사가 없어요'}
      </Text>
      <Text style={styles.emptyDescription}>
        {!isAuthenticated
          ? '로그인하고 마음에 드는 상담사를 저장해보세요'
          : '마음에 드는 철학자를 즐겨찾기에 추가해보세요'}
      </Text>
      <AnimatedButton style={styles.browseButton} onPress={handleStartChat} scaleTo={0.95} springConfig={{ damping: 12, stiffness: 160 }}>
        <Text style={styles.browseButtonText}>
          {!isAuthenticated ? '로그인하기' : '상담사 둘러보기'}
        </Text>
      </AnimatedButton>
    </View>
  );
});

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#374151',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
});
