import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SessionCard from '@/components/session/SessionCard';
import SessionListContainer from '@/components/session/SessionListContainer';
import { spacing } from '@/constants/theme';
import { useSessions } from '@/hooks/useSessions';
import { toggleSessionBookmark } from '@/services/sessions';
import type { Session } from '@/services/sessions/types';
import { useToast } from '@/store/toastStore';

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState('0');

  // 진행중 세션
  const {
    data: activeData,
    isLoading: activeLoading,
    refetch: refetchActive,
  } = useSessions(1, 20, undefined, false);

  // 종료된 세션
  const {
    data: closedData,
    isLoading: closedLoading,
    refetch: refetchClosed,
  } = useSessions(1, 20, undefined, true);

  // 북마크된 세션
  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    refetch: refetchBookmarked,
  } = useSessions(1, 20, true, undefined);

  const activeSessions = activeData?.content || [];
  const closedSessions = closedData?.content || [];
  const bookmarkedSessions = bookmarkedData?.content || [];

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

  const renderActiveSession = useCallback(
    (session: Session) => (
      <SessionCard
        key={session.sessionId}
        session={session}
        variant="active"
        onBookmarkToggle={() => handleBookmarkToggle(session.sessionId)}
      />
    ),
    [handleBookmarkToggle],
  );

  const renderClosedSession = useCallback(
    (session: Session) => (
      <SessionCard
        key={session.sessionId}
        session={session}
        variant="closed"
        onBookmarkToggle={() => handleBookmarkToggle(session.sessionId)}
      />
    ),
    [handleBookmarkToggle],
  );

  const renderBookmarkedSession = useCallback(
    (session: Session) => (
      <SessionCard
        key={session.sessionId}
        session={session}
        variant="bookmarked"
        onBookmarkToggle={() => handleBookmarkToggle(session.sessionId)}
      />
    ),
    [handleBookmarkToggle],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>상담 내역</Text>
        <Text style={styles.subtitle}>나의 상담 기록을 확인하세요</Text>
      </View>

      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={tabIndex}
          onValueChange={setTabIndex}
          buttons={[
            {
              value: '0',
              label: '진행중',
              icon: 'chat-processing',
            },
            {
              value: '1',
              label: '종료됨',
              icon: 'check-circle',
            },
            {
              value: '2',
              label: '북마크',
              icon: 'star',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.content}>
        {tabIndex === '0' && (
          <SessionListContainer
            sessions={activeSessions}
            isLoading={activeLoading}
            onRefresh={refetchActive}
            emptyIcon="chat-processing"
            emptyTitle="진행 중인 상담이 없습니다"
            emptySubtitle="새로운 상담을 시작해보세요!"
            emptyAction={{
              label: '상담 시작하기',
              onPress: handleNewSession,
            }}
            renderItem={renderActiveSession}
          />
        )}

        {tabIndex === '1' && (
          <SessionListContainer
            sessions={closedSessions}
            isLoading={closedLoading}
            onRefresh={refetchClosed}
            emptyIcon="check-circle"
            emptyTitle="종료된 상담이 없습니다"
            emptySubtitle="상담을 완료하면 여기에 표시됩니다"
            renderItem={renderClosedSession}
          />
        )}

        {tabIndex === '2' && (
          <SessionListContainer
            sessions={bookmarkedSessions}
            isLoading={bookmarkedLoading}
            onRefresh={refetchBookmarked}
            emptyIcon="star"
            emptyTitle="북마크한 상담이 없습니다"
            emptySubtitle="중요한 상담은 ⭐을 눌러 저장하세요"
            renderItem={renderBookmarkedSession}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  tabContainer: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});
