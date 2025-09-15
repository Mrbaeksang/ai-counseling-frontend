import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';
import type { Session } from '@/services/sessions/types';

// 상담내역 탭 전용 크기 (헤더 + 세그먼트 버튼 고려)
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
export const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm) / 2; // 정확히 2개씩

// 상담내역 탭은 추가 UI 요소가 있음
// - 상태바: ~40px
// - 헤더: ~90px (title + subtitle)
// - 세그먼트 버튼: ~60px
// - 탭바: ~80px
// - 여백: ~40px
const availableHeight = screenHeight - 310; // 더 많은 공간 차지
export const CARD_HEIGHT = Math.min(
  (availableHeight - spacing.lg) / 2, // 2행이 정확히 들어가도록
  CARD_WIDTH * 1.5 // 최대 비율 제한
);

interface VisualSessionCardProps {
  session: Session;
  onBookmarkToggle?: () => void;
}

export const VisualSessionCard = React.memo(
  ({ session, onBookmarkToggle }: VisualSessionCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/session/${session.sessionId}`);
    }, [session.sessionId]);

    const handleBookmarkPress = useCallback((e: any) => {
      e.stopPropagation();
      onBookmarkToggle?.();
    }, [onBookmarkToggle]);

    const imageSource = getCounselorImage(session.avatarUrl);

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMillis = now.getTime() - date.getTime();
      const diffInHours = diffInMillis / (1000 * 60 * 60);
      const diffInMinutes = diffInMillis / (1000 * 60);

      if (diffInMinutes < 1) {
        return '방금 전';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}분 전`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}시간 전`;
      } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
      }
    };

    const isActive = !session.closedAt;

    return (
      <AnimatedButton
        onPress={handlePress}
        scaleTo={0.96}
        springConfig={{ damping: 12, stiffness: 160 }}
      >
        <View style={styles.card}>
          {/* 전체 배경 이미지 */}
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
                {session.counselorName?.substring(0, 2) || '철학'}
              </Text>
            </LinearGradient>
          )}

          {/* 그라데이션 오버레이 */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.overlay}
          />

          {/* 상태 뱃지 (진행중/종료) */}
          <View style={[
            styles.statusBadge,
            isActive ? styles.activeBadge : styles.closedBadge
          ]}>
            <MaterialCommunityIcons
              name={isActive ? 'chat-processing' : 'check-circle'}
              size={12}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>
              {isActive ? '진행중' : '종료됨'}
            </Text>
          </View>

          {/* 북마크 버튼 */}
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

          {/* 하단 정보 영역 */}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {session.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.counselorName} numberOfLines={1}>
                {session.counselorName}
              </Text>
              <Text style={styles.time}>
                {formatTime(session.closedAt || session.lastMessageAt)}
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
    height: '35%', // 즐겨찾기와 동일
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
  counselorName: {
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