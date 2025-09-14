import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';
import type { Counselor } from '@/services/counselors/types';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface CounselorGridCardProps {
  counselor: Counselor;
  onFavoriteToggle: () => void;
}

export const CounselorGridCard = React.memo(
  ({ counselor, onFavoriteToggle }: CounselorGridCardProps) => {
    const imageSource = getCounselorImage(counselor.avatarUrl);

    const handlePress = useCallback(() => {
      router.push(`/counselors/${counselor.id}`);
    }, [counselor.id]);

    const handleFavoritePress = useCallback(
      (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onFavoriteToggle();
      },
      [onFavoriteToggle],
    );

    return (
      <AnimatedButton
        style={styles.container}
        onPress={handlePress}
        scaleTo={0.94}
        springConfig={{ damping: 10, stiffness: 150 }}
      >
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image source={imageSource} style={styles.image} contentFit="cover" transition={200} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>{counselor.name.substring(0, 2)}</Text>
            </View>
          )}

          {/* 향상된 그라데이션 오버레이 */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.5, 1]}
            style={styles.overlay}
          />

          {/* 다크 배경 레이어 추가 */}
          <View style={styles.darkBackdrop} />

          {/* 즐겨찾기 버튼 */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={counselor.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={counselor.isFavorite ? '#EF4444' : 'white'}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>

          {/* 상담사 정보 */}
          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {counselor.name}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {counselor.title}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="star" size={12} color="#FCD34D" />
                <Text style={styles.statText}>
                  {counselor.averageRating > 0 ? (counselor.averageRating / 10).toFixed(1) : '0.0'}
                </Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="message-text"
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.statText}>{counselor.totalSessions}</Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedButton>
    );
  },
);

CounselorGridCard.displayName = 'CounselorGridCard';

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  darkBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 65,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: 'white',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 10,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statText: {
    fontSize: 10,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
