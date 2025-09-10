import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// 화면 너비에서 padding을 뺀 후 2로 나누고, 카드 간격 고려
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm) / 2;
const CARD_HEIGHT = (screenHeight - 220) / 2; // 화면 높이에서 헤더, 탭바 등 제외하고 2행으로 나눔

interface FavoriteCounselorCardProps {
  counselor: FavoriteCounselorResponse;
  onFavoriteToggle?: () => void;
}

export const FavoriteCounselorCard = React.memo(
  ({ counselor, onFavoriteToggle }: FavoriteCounselorCardProps) => {
    const handlePress = useCallback(() => {
      // 상담사 상세 페이지로 이동 (홈과 동일)
      router.push(`/counselors/${counselor.id}`);
    }, [counselor.id]);

    const imageSource = getCounselorImage(counselor.avatarUrl);

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.card}>
          {/* 이미지가 카드 전체를 차지 */}
          {imageSource ? (
            <Image source={imageSource} style={styles.fullImage} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={['#EC4899', '#F472B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fullImage}
            >
              <Text style={styles.avatarPlaceholder}>{counselor.name.substring(0, 2)}</Text>
            </LinearGradient>
          )}

          {/* 그라데이션 오버레이 (하단 어둡게) */}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.overlay} />

          {/* 하트 아이콘 - 클릭시 즐겨찾기 해제 */}
          <TouchableOpacity
            style={styles.heartBadge}
            onPress={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트와 분리
              onFavoriteToggle?.();
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="heart" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* 하단 정보 영역 */}
          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {counselor.name}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.title} numberOfLines={1}>
                {counselor.title || '철학자'}
              </Text>
              {counselor.averageRating > 0 && (
                <View style={styles.rating}>
                  <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                  <Text style={styles.ratingText}>{(counselor.averageRating / 10).toFixed(1)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
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
    fontSize: CARD_WIDTH * 0.3,
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
    height: CARD_HEIGHT * 0.4,
  },
  heartBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#FFFFFF',
  },
});
