import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconButton, Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import type { Session } from '@/services/sessions/types';

interface SessionCardProps {
  session: Session;
  variant?: 'active' | 'closed' | 'bookmarked';
  onBookmarkToggle?: () => void;
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};

export const SessionCard = React.memo(
  ({ session, variant = 'active', onBookmarkToggle }: SessionCardProps) => {
    const handlePress = useCallback(() => {
      setTimeout(() => {
        router.push(`/session/${session.sessionId}`);
      }, 200);
    }, [session.sessionId]);

    const isActive = !session.closedAt;
    const showStatusBadge = variant === 'bookmarked';

    return (
      <AnimatedButton
        onPress={handlePress}
        scaleTo={0.92}
        springConfig={{ damping: 10, stiffness: 150 }}
        style={styles.cardWrapper}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <View style={styles.characterInfo}>
                <View style={styles.avatar}>
                  {session.avatarUrl ? (
                    <Image
                      source={getCharacterImage(session.avatarUrl)}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {session.characterName?.substring(0, 2) || 'AI'}
                    </Text>
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text variant="titleMedium" style={styles.title}>
                    {session.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.characterName}>
                    {session.characterName}
                    {' AI 캐릭터'}
                  </Text>
                  <Text variant="bodySmall" style={styles.time}>
                    {session.closedAt
                      ? `종료: ${formatRelativeTime(session.closedAt)}`
                      : `최근 대화: ${formatRelativeTime(session.lastMessageAt)}`}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                {showStatusBadge && (
                  <Chip
                    mode="flat"
                    compact
                    style={[styles.statusChip, isActive ? styles.activeChip : styles.closedChip]}
                  >
                    {isActive ? '진행 중' : '완료'}
                  </Chip>
                )}
                <AnimatedButton
                  onPress={onBookmarkToggle}
                  scaleTo={0.85}
                  springConfig={{ damping: 10, stiffness: 300 }}
                  style={styles.bookmarkButton}
                >
                  <IconButton
                    icon={session.isBookmarked ? 'star' : 'star-outline'}
                    iconColor={session.isBookmarked ? '#FFD700' : '#666'}
                    size={24}
                    disabled
                  />
                </AnimatedButton>
              </View>
            </View>

            {variant === 'active' && (
              <Button mode="contained" style={styles.actionButton} onPress={handlePress}>
                대화 이어하기
              </Button>
            )}

            {variant === 'closed' && (
              <Button mode="outlined" style={styles.actionButton} onPress={handlePress}>
                AI 기록 보기
              </Button>
            )}
          </Card.Content>
        </Card>
      </AnimatedButton>
    );
  },
);

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    elevation: 2,
  },
  bookmarkButton: {
    marginRight: -8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  characterInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  characterName: {
    color: '#666',
    marginBottom: 2,
  },
  time: {
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: 8,
    height: 24,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  closedChip: {
    backgroundColor: '#F3E5F5',
  },
  actionButton: {
    marginTop: 12,
  },
});

export default SessionCard;
