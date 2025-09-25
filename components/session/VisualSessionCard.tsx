import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import type { Session } from '@/services/sessions/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
export const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm) / 2;
const availableHeight = screenHeight - 310;
export const CARD_HEIGHT = Math.min((availableHeight - spacing.lg) / 2, CARD_WIDTH * 1.5);

interface VisualSessionCardProps {
  session: Session;
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

export const VisualSessionCard = React.memo(
  ({ session, onBookmarkToggle }: VisualSessionCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/session/${session.sessionId}`);
    }, [session.sessionId]);

    const handleBookmarkPress = useCallback(
      (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onBookmarkToggle?.();
      },
      [onBookmarkToggle],
    );

    const imageSource = getCharacterImage(session.avatarUrl);
    const isActive = !session.closedAt;

    return (
      <AnimatedButton
        onPress={handlePress}
        scaleTo={0.96}
        springConfig={{ damping: 12, stiffness: 160 }}
      >
        <View style={styles.card}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.fullImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <LinearGradient
              colors={['#6B46C1', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fullImage}
            >
              <Text style={styles.avatarPlaceholder}>
                {session.characterName?.substring(0, 2) || 'AI'}
              </Text>
            </LinearGradient>
          )}

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.overlay} />

          <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.closedBadge]}>
            <MaterialCommunityIcons
              name={isActive ? 'chat-processing' : 'check-circle'}
              size={12}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>{isActive ? '진행 중' : '완료'}</Text>
          </View>

          <AnimatedButton
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
            scaleTo={0.85}
            springConfig={{ damping: 15, stiffness: 200 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={session.isBookmarked ? 'star' : 'star-outline'}
              size={18}
              color={session.isBookmarked ? '#FFD700' : '#FFFFFF'}
            />
          </AnimatedButton>

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {session.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.characterName} numberOfLines={1}>
                {session.characterName}
              </Text>
              <Text style={styles.time}>
                {formatRelativeTime(session.closedAt || session.lastMessageAt)}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedButton>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fullImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    fontSize: CARD_WIDTH * 0.25,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: CARD_HEIGHT * 0.35,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  closedBadge: {
    backgroundColor: 'rgba(107, 70, 193, 0.9)',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterName: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255, 255, 255, 0.95)',
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
