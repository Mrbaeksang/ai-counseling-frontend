import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import type { CharacterDetail } from '@/services/characters/types';

interface ProfileHeaderProps {
  character: CharacterDetail;
}

export const ProfileHeader = React.memo(({ character }: ProfileHeaderProps) => {
  const imageSource = getCharacterImage(character.avatarUrl);

  return (
    <LinearGradient
      colors={['#6B46C1', '#9333EA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <AnimatedButton
          onPress={() => router.back()}
          style={styles.backButton}
          scaleTo={0.88}
          springConfig={{ damping: 15, stiffness: 200 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </AnimatedButton>
      </View>

      <View style={styles.profileSection}>
        {imageSource ? (
          <Image source={imageSource} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{character.name.substring(0, 2)}</Text>
          </View>
        )}

        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.title}>{character.title}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={16} color="#FCD34D" />
            <Text style={styles.statText}>
              {character.averageRating > 0 ? (character.averageRating / 20).toFixed(1) : '0.0'}
            </Text>
            <Text style={styles.statSubtext}>리뷰 {character.totalRatings || 0}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="message-text" size={16} color="white" />
            <Text style={styles.statText}>{character.totalSessions.toLocaleString()}</Text>
            <Text style={styles.statSubtext}>대화 횟수</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'white',
    marginBottom: spacing.lg,
    borderWidth: 7,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
  },
  avatarPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 7,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  avatarText: {
    fontSize: 84,
    fontWeight: '700',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: 'white',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: 'white',
  },
  statSubtext: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
