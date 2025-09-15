import { FlashList } from '@shopify/flash-list';
import React, { type ReactElement, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { spacing } from '@/constants/theme';
import type { Session } from '@/services/sessions/types';
import EmptySessionState from './EmptySessionState';
import SessionCardSkeleton from './SessionCardSkeleton';
import { VisualSessionCard } from './VisualSessionCard';

interface SessionListContainerProps {
  sessions: Session[];
  isLoading: boolean;
  isRefreshing?: boolean;
  hasMore?: boolean;
  emptyIcon: 'chat-processing' | 'check-circle' | 'star';
  emptyTitle: string;
  emptySubtitle?: string;
  emptyAction?: {
    label: string;
    onPress: () => void;
  };
  onRefresh?: () => void;
  onEndReached?: () => void;
  renderItem?: (session: Session) => ReactElement;
  onBookmarkToggle?: (sessionId: number) => void;
  layoutMode?: 'list' | 'grid'; // 레이아웃 모드 추가
}

export const SessionListContainer = React.memo(
  ({
    sessions,
    isLoading,
    isRefreshing = false,
    hasMore = false,
    emptyIcon,
    emptyTitle,
    emptySubtitle,
    emptyAction,
    onRefresh,
    onEndReached,
    renderItem,
    onBookmarkToggle,
    layoutMode = 'list',
  }: SessionListContainerProps) => {
    // 그리드 모드용 렌더 아이템
    const renderGridItem = useCallback(
      ({ item }: { item: Session }) => (
        <View style={styles.gridItem}>
          <VisualSessionCard
            session={item}
            onBookmarkToggle={() => onBookmarkToggle?.(item.sessionId)}
          />
        </View>
      ),
      [onBookmarkToggle],
    );

    // 로딩 상태
    if (isLoading && sessions.length === 0) {
      if (layoutMode === 'grid') {
        return (
          <View style={styles.gridContainer}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.skeletonItem}>
                <SessionCardSkeleton />
              </View>
            ))}
          </View>
        );
      }
      return (
        <View style={styles.container}>
          {[1, 2, 3].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    // 빈 상태
    if (!isLoading && sessions.length === 0) {
      return (
        <EmptySessionState
          icon={emptyIcon}
          title={emptyTitle}
          subtitle={emptySubtitle}
          actionButton={emptyAction}
        />
      );
    }

    // 그리드 레이아웃
    if (layoutMode === 'grid') {
      return (
        <FlatList
          data={sessions}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.sessionId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#6B46C1']}
              />
            ) : undefined
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore || isLoading ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color="#6B46C1" />
              </View>
            ) : null
          }
        />
      );
    }

    // 리스트 레이아웃 (기존)
    return (
      <FlashList
        data={sessions}
        keyExtractor={(item) => item.sessionId.toString()}
        renderItem={({ item }) => renderItem?.(item) ?? null}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#6B46C1']} />
          ) : undefined
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#6B46C1" />
            </View>
          ) : null
        }
        contentContainerStyle={sessions.length === 0 ? styles.emptyContainer : undefined}
        // FlashList 최적화
        drawDistance={200}
        // @ts-expect-error - FlashList 타입 정의에 estimatedItemSize가 누락됨
        estimatedItemSize={120}
      />
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  // 그리드 레이아웃 스타일
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    justifyContent: 'space-between',
  },
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  gridItem: {
    // 카드 자체 크기가 이미 계산되어 있음
  },
  skeletonItem: {
    width: '48%',
    marginBottom: spacing.lg,
  },
});

export default SessionListContainer;
