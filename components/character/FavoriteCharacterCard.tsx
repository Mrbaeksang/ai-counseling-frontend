import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import type { FavoriteCharacterResponse } from '@/services/characters/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Card size is derived from the device dimensions so two items fit per row.
export const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm) / 2;
const availableHeight = screenHeight - 180; // subtract rough header/nav space
export const CARD_HEIGHT = Math.max(
  CARD_WIDTH * 1.5,
  Math.min(availableHeight * 0.48, CARD_WIDTH * 1.8),
);

interface FavoriteCharacterCardProps {
  character: FavoriteCharacterResponse;
  onFavoriteToggle?: () => void;
}

export const FavoriteCharacterCard = React.memo(
  ({ character, onFavoriteToggle }: FavoriteCharacterCardProps) => {
    const handlePress = useCallback(() => {
      router.push(`/characters/${character.id}`);
    }, [character.id]);

    const imageSource = getCharacterImage(character.avatarUrl);

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
              colors={['#EC4899', '#F472B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fullImage}
            >
              <Text style={styles.avatarPlaceholder}>{character.name.substring(0, 2)}</Text>
            </LinearGradient>
          )}

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.overlay} />

          <AnimatedButton
            style={styles.heartBadge}
            onPress={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            scaleTo={0.85}
            springConfig={{ damping: 15, stiffness: 200 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="heart" size={16} color="#FFFFFF" />
          </AnimatedButton>

          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {character.name}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.title} numberOfLines={1}>
                {character.title || 'AI Character'}
              </Text>
              {character.averageRating > 0 && (
                <View style={styles.rating}>
                  <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                  <Text style={styles.ratingText}>{(character.averageRating / 20).toFixed(1)}</Text>
                </View>
              )}
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
    marginRight: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
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
