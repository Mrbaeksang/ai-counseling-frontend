import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';
import { useDeleteSession, useSessions } from '@/hooks/useSessions';
import type { Session } from '@/services/sessions/types';

// 컴포넌트 외부로 이동하여 재생성 방지
interface SessionItemProps {
  item: Session;
  onPress: (session: Session) => void;
  onDelete: (sessionId: number) => void;
  formatDate: (dateString: string) => string;
}

const SessionItem = React.memo(({ item, onPress, onDelete, formatDate }: SessionItemProps) => (
  <Surface style={styles.sessionCard}>
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.sessionHeader}>
        <View style={styles.counselorInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.counselorName?.substring(0, 2) || '상담'}</Text>
          </View>
          <View style={styles.sessionDetails}>
            <Text style={styles.counselorName}>{item.counselorName || '철학자'}</Text>
            <Text style={styles.sessionDate}>{formatDate(item.lastMessageAt)}</Text>
          </View>
        </View>
        <View style={styles.sessionActions}>
          {/* <Text style={styles.messageCount}>{item.messageCount || 0}개 메시지</Text> */}
          <IconButton icon="delete-outline" size={20} onPress={() => onDelete(item.sessionId)} />
        </View>
      </View>
      {/* {item.lastMessage && (
        <>
          <Divider style={styles.divider} />
          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </>
      )} */}
    </TouchableOpacity>
  </Surface>
));

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const { data: sessionsData, isLoading, refetch } = useSessions();
  const { mutate: deleteSession } = useDeleteSession();

  const sessions = sessionsData?.content || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handleSessionPress = (session: Session) => {
    router.push(`/session/${session.sessionId}`);
  };

  const handleDeleteSession = (sessionId: number) => {
    deleteSession(sessionId);
  };

  const renderSession = ({ item }: { item: Session }) => (
    <SessionItem
      item={item}
      onPress={handleSessionPress}
      onDelete={handleDeleteSession}
      formatDate={formatDate}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>대화 내역</Text>
        <Text style={styles.subtitle}>지난 상담 기록을 확인하세요</Text>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.sessionId.toString()}
        renderItem={renderSession}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="chat-processing-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>아직 대화 내역이 없습니다</Text>
            <Text style={styles.emptyDescription}>상담사를 선택하고 대화를 시작해보세요</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
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
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.md,
    elevation: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counselorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Pretendard-SemiBold',
  },
  sessionDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  counselorName: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
  },
  sessionDate: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#9CA3AF',
  },
  divider: {
    marginVertical: spacing.sm,
    backgroundColor: '#F3F4F6',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
    marginTop: spacing.md,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: spacing.xs,
  },
});
