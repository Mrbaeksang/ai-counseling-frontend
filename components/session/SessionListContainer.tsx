import { FlashList } from '@shopify/flash-list';
import React, { type ReactElement } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import type { Session } from '@/services/sessions/types';
import EmptySessionState from './EmptySessionState';
import SessionCardSkeleton from './SessionCardSkeleton';

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
  renderItem: (session: Session) => ReactElement;
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
  }: SessionListContainerProps) => {
    if (isLoading && sessions.length === 0) {
      return (
        <View style={styles.container}>
          {[1, 2, 3].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </View>
      );
    }

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

    return (
      <FlashList
        data={sessions}
        keyExtractor={(item) => item.sessionId.toString()}
        renderItem={({ item }) => renderItem(item)}
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
});

export default SessionListContainer;
