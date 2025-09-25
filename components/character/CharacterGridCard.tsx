import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { getCharacterImage } from '@/constants/characterImages';
import { spacing } from '@/constants/theme';
import type { Character } from '@/services/characters/types';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface CharacterGridCardProps {
  character: Character;
  onFavoriteToggle: () => void;
}

export const CharacterGridCard = React.memo(
  ({ character, onFavoriteToggle }: CharacterGridCardProps) => {
    const imageSource = getCharacterImage(character.avatarUrl);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = useCallback(() => {
      router.push(`/characters/${character.id}`);
    }, [character.id]);

    const handleFavoritePress = useCallback(() => {
      // ?�니메이???�행
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      onFavoriteToggle();
    }, [onFavoriteToggle, scaleAnim]);

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
              <Text style={styles.placeholderText}>{character.name.substring(0, 2)}</Text>
            </View>
          )}

          {/* ?�상??그라?�이???�버?�이 */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.5, 1]}
            style={styles.overlay}
          />

          {/* ?�크 배경 ?�이??추�? */}
          <View style={styles.darkBackdrop} />

          {/* 즐겨찾기 버튼 - Pressable + Animated.View 조합 */}
          <Pressable
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.favoriteButton}
          >
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <MaterialCommunityIcons
                name={character.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={character.isFavorite ? '#EF4444' : 'white'}
                style={styles.favoriteIcon}
              />
            </Animated.View>
          </Pressable>

          {/* AI 캐릭???�보 */}
          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {character.name}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {character.title}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <MaterialCommunityIcons name="star" size={12} color="#FCD34D" />
                <Text style={styles.statText}>
                  {character.averageRating > 0 ? (character.averageRating / 20).toFixed(1) : '0.0'}
                </Text>
              </View>
              <View style={styles.stat}>
                <MaterialCommunityIcons
                  name="message-text"
                  size={12}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.statText}>{character.totalSessions}</Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedButton>
    );
  },
);

CharacterGridCard.displayName = 'CharacterGridCard';

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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
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
