import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { FavoriteCounselorCard } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';

interface FavoritesListProps {
  favorites: FavoriteCounselorResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
  onFavoriteToggle: (counselorId: number) => void;
}

export const FavoritesList = React.memo(
  ({
    favorites,
    isLoading,
    isRefreshing,
    isAuthenticated,
    onRefresh,
    onFavoriteToggle,
  }: FavoritesListProps) => {
    const handleStartChat = useCallback(() => {
      router.push('/(tabs)/');
    }, []);

    const renderCounselor = useCallback(
      ({ item }: { item: FavoriteCounselorResponse }) => (
        <View style={styles.cardWrapper}>
          <FavoriteCounselorCard counselor={item} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onFavoriteToggle(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ),
      [onFavoriteToggle],
    );

    const renderSkeleton = useCallback(
      ({ index }: { index: number }) => <CounselorCardSkeleton key={`skeleton-${index}`} />,
      [],
    );

    const ListHeader = useCallback(
      () => (
        <View style={styles.header}>
          <Text style={styles.title}>즐겨찾기</Text>
          <Text style={styles.subtitle}>자주 상담받는 철학자들을 모아보세요</Text>
        </View>
      ),
      [],
    );

    const ListEmpty = useCallback(
      () => (
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
          <TouchableOpacity style={styles.browseButton} onPress={handleStartChat}>
            <Text style={styles.browseButtonText}>
              {!isAuthenticated ? '로그인하기' : '상담사 둘러보기'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
      [isAuthenticated, handleStartChat],
    );

    if (!isAuthenticated) {
      return (
        <>
          <ListHeader />
          <ListEmpty />
        </>
      );
    }

    return (
      <FlatList
        data={isLoading ? Array(6).fill({}) : favorites}
        renderItem={isLoading ? renderSkeleton : renderCounselor}
        keyExtractor={(item, index) => (isLoading ? `skeleton-${index}` : `favorite-${item.id}`)}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!isLoading ? ListEmpty : null}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.lg,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
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
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
});
