import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SessionListContainer from '@/components/session/SessionListContainer';
import { SessionTabs } from '@/components/session/SessionTabs';
import { spacing } from '@/constants/theme';
import { useSessions } from '@/hooks/useSessions';
import { toggleSessionBookmark } from '@/services/sessions';
import type { Session } from '@/services/sessions/types';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/store/toastStore';

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const theme = useTheme();
  const { user } = useAuthStore();
  const [tabIndex, setTabIndex] = useState('0');

  // 페이지네이션 상태
  const [activePage, setActivePage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [bookmarkedPage, setBookmarkedPage] = useState(1);

  // 누적 세션 데이터
  const [allActiveSessions, setAllActiveSessions] = useState<Session[]>([]);
  const [allClosedSessions, setAllClosedSessions] = useState<Session[]>([]);
  const [allBookmarkedSessions, setAllBookmarkedSessions] = useState<Session[]>([]);

  // 진행중 세션
  const {
    data: activeData,
    isLoading: activeLoading,
    refetch: refetchActive,
  } = useSessions(activePage, 10, undefined, false);

  // 종료된 세션
  const {
    data: closedData,
    isLoading: closedLoading,
    refetch: refetchClosed,
  } = useSessions(closedPage, 10, undefined, true);

  // 북마크된 세션
  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    refetch: refetchBookmarked,
  } = useSessions(bookmarkedPage, 10, true, undefined);

  // 데이터가 로드되면 누적 배열에 추가
  useEffect(() => {
    if (activeData?.content) {
      if (activePage === 1) {
        setAllActiveSessions(activeData.content);
      } else {
        setAllActiveSessions((prev) => [...prev, ...activeData.content]);
      }
    }
  }, [activeData, activePage]);

  useEffect(() => {
    if (closedData?.content) {
      if (closedPage === 1) {
        setAllClosedSessions(closedData.content);
      } else {
        setAllClosedSessions((prev) => [...prev, ...closedData.content]);
      }
    }
  }, [closedData, closedPage]);

  useEffect(() => {
    if (bookmarkedData?.content) {
      if (bookmarkedPage === 1) {
        setAllBookmarkedSessions(bookmarkedData.content);
      } else {
        setAllBookmarkedSessions((prev) => [...prev, ...bookmarkedData.content]);
      }
    }
  }, [bookmarkedData, bookmarkedPage]);

  const handleBookmarkToggle = useCallback(
    async (sessionId: number) => {
      try {
        const result = await toggleSessionBookmark(sessionId);
        toast.show(
          result.isBookmarked ? '북마크에 추가되었습니다' : '북마크가 제거되었습니다',
          'success',
        );

        // 모든 탭 데이터 새로고침
        refetchActive();
        refetchClosed();
        refetchBookmarked();
      } catch (error: unknown) {
        void error;
        toast.show('북마크 변경에 실패했습니다', 'error');
      }
    },
    [refetchActive, refetchClosed, refetchBookmarked, toast],
  );

  const handleNewSession = useCallback(() => {
    router.push('/(tabs)/');
  }, []);

  // 무한 스크롤 핸들러
  const handleLoadMoreActive = useCallback(() => {
    if (!activeLoading && activeData?.pageInfo?.hasNext) {
      setActivePage((prev) => prev + 1);
    }
  }, [activeLoading, activeData]);

  const handleLoadMoreClosed = useCallback(() => {
    if (!closedLoading && closedData?.pageInfo?.hasNext) {
      setClosedPage((prev) => prev + 1);
    }
  }, [closedLoading, closedData]);

  const handleLoadMoreBookmarked = useCallback(() => {
    if (!bookmarkedLoading && bookmarkedData?.pageInfo?.hasNext) {
      setBookmarkedPage((prev) => prev + 1);
    }
  }, [bookmarkedLoading, bookmarkedData]);

  // 새로고침 핸들러
  const handleRefreshActive = useCallback(() => {
    setActivePage(1);
    refetchActive();
  }, [refetchActive]);

  const handleRefreshClosed = useCallback(() => {
    setClosedPage(1);
    refetchClosed();
  }, [refetchClosed]);

  const handleRefreshBookmarked = useCallback(() => {
    setBookmarkedPage(1);
    refetchBookmarked();
  }, [refetchBookmarked]);

  // 비로그인 사용자 처리
  if (!user) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <View style={{ alignItems: 'center', padding: spacing.xl }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Pretendard-SemiBold',
              color: theme.colors.onBackground,
              marginBottom: spacing.md,
            }}
          >
            로그인이 필요합니다
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Pretendard-Regular',
              color: theme.colors.onSurfaceVariant,
              textAlign: 'center',
              marginBottom: spacing.xl,
            }}
          >
            로그인하시면 상담 내역을 확인하고{'\n'}저장하실 수 있습니다
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(auth)/login')}
            style={{ borderRadius: 12 }}
            contentStyle={{ height: 48, paddingHorizontal: spacing.xl }}
          >
            로그인하기
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <SessionTabs tabIndex={tabIndex} onTabChange={setTabIndex} />

      <View style={styles.content}>
        {tabIndex === '0' && (
          <SessionListContainer
            sessions={allActiveSessions}
            isLoading={activeLoading && activePage === 1}
            isRefreshing={false}
            hasMore={activeData?.pageInfo?.hasNext}
            onRefresh={handleRefreshActive}
            onEndReached={handleLoadMoreActive}
            emptyIcon="chat-processing"
            emptyTitle="진행 중인 상담이 없습니다"
            emptySubtitle="새로운 상담을 시작해보세요!"
            emptyAction={{
              label: '상담 시작하기',
              onPress: handleNewSession,
            }}
            onBookmarkToggle={handleBookmarkToggle}
            layoutMode="grid"
          />
        )}

        {tabIndex === '1' && (
          <SessionListContainer
            sessions={allClosedSessions}
            isLoading={closedLoading && closedPage === 1}
            isRefreshing={false}
            hasMore={closedData?.pageInfo?.hasNext}
            onRefresh={handleRefreshClosed}
            onEndReached={handleLoadMoreClosed}
            emptyIcon="check-circle"
            emptyTitle="종료된 상담이 없습니다"
            emptySubtitle="상담을 완료하면 여기에 표시됩니다"
            onBookmarkToggle={handleBookmarkToggle}
            layoutMode="grid"
          />
        )}

        {tabIndex === '2' && (
          <SessionListContainer
            sessions={allBookmarkedSessions}
            isLoading={bookmarkedLoading && bookmarkedPage === 1}
            isRefreshing={false}
            hasMore={bookmarkedData?.pageInfo?.hasNext}
            onRefresh={handleRefreshBookmarked}
            onEndReached={handleLoadMoreBookmarked}
            emptyIcon="star"
            emptyTitle="북마크한 상담이 없습니다"
            emptySubtitle="중요한 상담은 ⭐을 눌러 저장하세요"
            onBookmarkToggle={handleBookmarkToggle}
            layoutMode="grid"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
