import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { getCounselorImage } from '@/constants/counselorImages';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselor } from '@/services/counselors/types';

interface FavoriteCounselorCardProps {
  counselor: FavoriteCounselor;
}

export function FavoriteCounselorCard({ counselor }: FavoriteCounselorCardProps) {
  const handlePress = () => {
    router.push(`/session/new?counselorId=${counselor.id}`);
  };

  const imageSource = getCounselorImage(counselor.avatarUrl);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Surface style={styles.card}>
        <LinearGradient
          colors={['#FEF3F2', '#FFF5F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.heartIcon}>
            <MaterialCommunityIcons name="heart" size={14} color="#EF4444" />
          </View>

          <View style={styles.container}>
            {imageSource ? (
              <Image source={imageSource} style={styles.avatar} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={['#EC4899', '#F472B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>{counselor.name.substring(0, 2)}</Text>
              </LinearGradient>
            )}

            <Text style={styles.name} numberOfLines={1}>
              {counselor.name}
            </Text>

            <Text style={styles.title} numberOfLines={1}>
              {counselor.title || '철학자'}
            </Text>

            {counselor.averageRating > 0 && (
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingText}>{(counselor.averageRating / 10).toFixed(1)}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 140,
    marginRight: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: spacing.sm,
    paddingTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginBottom: spacing.xs,
    backgroundColor: '#F3F4F6',
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: 11,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Pretendard-Medium',
    color: '#374151',
  },
});
