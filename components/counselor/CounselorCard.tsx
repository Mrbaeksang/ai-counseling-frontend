import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';
import { useThrottle } from '@/hooks/useDebounce';
import type { Counselor } from '@/services/counselors/types';

interface CounselorCardProps {
  counselor: Counselor;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export const CounselorCard = React.memo(
  ({ counselor, isFavorite, onFavoriteToggle }: CounselorCardProps) => {
    const handlePressRaw = () => {
      // 애니메이션이 보이도록 약간 지연 후 이동
      setTimeout(() => {
        router.push(`/counselors/${counselor.id}`);
      }, 200);
    };

    // 쓰로틀 적용 - 1초 동안 중복 클릭 방지
    const [handlePress, canClick] = useThrottle(handlePressRaw, 1000);

    const imageSource = getCounselorImage(counselor.avatarUrl);

    return (
      <AnimatedButton
        onPress={handlePress}
        disabled={!canClick}
        scaleTo={0.92}
        springConfig={{ damping: 10, stiffness: 150 }}
        style={styles.cardWrapper}
      >
        <Surface style={styles.card}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            {/* 즐겨찾기 버튼 */}
            <AnimatedButton
              onPress={onFavoriteToggle}
              style={styles.favoriteButton}
              scaleTo={0.85}
              springConfig={{ damping: 10, stiffness: 300 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              hapticStyle="medium"
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#EF4444' : '#9CA3AF'}
              />
            </AnimatedButton>

            {/* 프로필 이미지 */}
            <View style={styles.imageContainer}>
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.profileImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <LinearGradient
                  colors={['#6B46C1', '#9333EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileImagePlaceholder}
                >
                  <Text style={styles.placeholderText}>{counselor.name.substring(0, 2)}</Text>
                </LinearGradient>
              )}

              {/* 인기 뱃지 - 평균 4.0점 이상 */}
              {counselor.averageRating >= 80 && (
                <View style={styles.popularBadge}>
                  <MaterialCommunityIcons name="star" size={12} color="#FFF" />
                  <Text style={styles.badgeText}>인기</Text>
                </View>
              )}
            </View>

            {/* 정보 섹션 */}
            <View style={styles.infoSection}>
              <Text style={styles.name} numberOfLines={1}>
                {counselor.name}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {counselor.title}
              </Text>

              {/* 통계 */}
              <View style={styles.statsRow}>
                {counselor.averageRating > 0 ? (
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.statText}>{(counselor.averageRating / 20).toFixed(1)}</Text>
                  </View>
                ) : (
                  <View style={styles.statItem}>
                    <Text style={styles.statText}>신규</Text>
                  </View>
                )}

                {counselor.totalSessions > 0 && (
                  <Text style={styles.sessionCount}>
                    {counselor.totalSessions.toLocaleString()}회 상담
                  </Text>
                )}
              </View>
            </View>
          </LinearGradient>
        </Surface>
      </AnimatedButton>
    );
  },
);

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  gradientBackground: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
  },
  profileImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  popularBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  infoSection: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
  },
  sessionCount: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
});
