import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { spacing } from '@/constants/theme';

interface FavoritesEmptyStateProps {
  isAuthenticated: boolean;
}

export const FavoritesEmptyState = React.memo(({ isAuthenticated }: FavoritesEmptyStateProps) => {
  const theme = useTheme();
  const handleStartChat = useCallback(() => {
    router.push('/(tabs)/');
  }, []);

  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="heart-outline"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        {!isAuthenticated ? '로그인이 필요해요' : '아직 즐겨찾기한 AI 캐릭터가 없어요'}
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
        {!isAuthenticated
          ? '로그인하고 마음에 드는 AI 캐릭터를 살펴보세요'
          : '마음에 드는 AI 캐릭터를 즐겨찾기에 추가해보세요'}
      </Text>
      <AnimatedButton
        style={[
          styles.browseButton,
          { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary },
        ]}
        onPress={handleStartChat}
        scaleTo={0.95}
        springConfig={{ damping: 12, stiffness: 160 }}
      >
        <Text style={styles.browseButtonText}>
          {!isAuthenticated ? '로그인하기' : 'AI 캐릭터 둘러보기'}
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
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    shadowColor: 'transparent',
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
