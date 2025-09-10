import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { FavoriteCounselorCard } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import type { FavoriteCounselorResponse } from '@/services/counselors/types';

interface FavoritesListProps {
  favorites: FavoriteCounselorResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
  onFavoriteToggle: (counselorId: number) => void;
}

export const FavoritesList = React.memo(
  ({
    favorites,
    isLoading,
    isRefreshing,
    isAuthenticated,
    onRefresh,
    onFavoriteToggle,
  }: FavoritesListProps) => {
    const handleStartChat = useCallback(() => {
      router.push('/(tabs)/');
    }, []);

    // 스크롤 힌트 애니메이션
    const scrollHintAnim = useRef(new Animated.Value(1)).current;
    const [showScrollHint, setShowScrollHint] = useState(true);
    const firstRowRef = useRef<FlatList>(null);
    const secondRowRef = useRef<FlatList>(null);

    // 초기 진입시 스크롤 힌트 애니메이션
    useEffect(() => {
      if (favorites.length > 2 && showScrollHint) {
        // 펄스 애니메이션
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollHintAnim, {
              toValue: 0.3,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scrollHintAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();

        // 5초 후 힌트 숨기기
        const timer = setTimeout(() => {
          setShowScrollHint(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }, [favorites.length, showScrollHint, scrollHintAnim]);

    // 즐겨찾기를 2개의 행으로 나누기 (각 행에 더 많은 아이템)
    const [firstRow, secondRow] = useMemo(() => {
      if (isLoading) {
        return [Array(6).fill({}), Array(6).fill({})];
      }
      // 홀수 인덱스는 첫 번째 행, 짝수 인덱스는 두 번째 행
      const row1: FavoriteCounselorResponse[] = [];
      const row2: FavoriteCounselorResponse[] = [];
      favorites.forEach((item, index) => {
        if (index % 2 === 0) {
          row1.push(item);
        } else {
          row2.push(item);
        }
      });
      return [row1, row2];
    }, [favorites, isLoading]);

    const renderCounselor = useCallback(
      ({ item }: { item: FavoriteCounselorResponse }) => (
        <View style={styles.cardContainer}>
          <FavoriteCounselorCard
            counselor={item}
            onFavoriteToggle={() => onFavoriteToggle(item.id)}
          />
        </View>
      ),
      [onFavoriteToggle],
    );

    const renderSkeleton = useCallback(
      ({ index }: { index: number }) => (
        <View style={styles.cardContainer}>
          <CounselorCardSkeleton key={`skeleton-${index}`} />
        </View>
      ),
      [],
    );

    const ListHeader = useCallback(
      () => (
        <LinearGradient
          colors={['#FFFFFF', '#FAF5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>✨ 즐겨찾기</Text>
            <Text style={styles.subtitle}>자주 상담받는 철학자들을 모아보세요</Text>
          </View>
        </LinearGradient>
      ),
      [],
    );

    const ListEmpty = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="heart-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {!isAuthenticated ? '로그인이 필요합니다' : '아직 즐겨찾기한 상담사가 없어요'}
          </Text>
          <Text style={styles.emptyDescription}>
            {!isAuthenticated
              ? '로그인하고 마음에 드는 상담사를 저장해보세요'
              : '마음에 드는 철학자를 즐겨찾기에 추가해보세요'}
          </Text>
          <TouchableOpacity style={styles.browseButton} onPress={handleStartChat}>
            <Text style={styles.browseButtonText}>
              {!isAuthenticated ? '로그인하기' : '상담사 둘러보기'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
      [isAuthenticated, handleStartChat],
    );

    if (!isAuthenticated) {
      return (
        <>
          <ListHeader />
          <ListEmpty />
        </>
      );
    }

    if (favorites.length === 0 && !isLoading) {
      return (
        <>
          <ListHeader />
          <ListEmpty />
        </>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <ListHeader />

        <View style={styles.rowsContainer}>
          {/* 첫 번째 행 */}
          <View style={styles.rowWrapper}>
            <FlatList
              ref={firstRowRef}
              horizontal
              data={firstRow}
              renderItem={isLoading ? renderSkeleton : renderCounselor}
              keyExtractor={(item, index) =>
                isLoading ? `skeleton-row1-${index}` : `favorite-row1-${item.id}`
              }
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rowContent}
              onScroll={() => setShowScrollHint(false)}
              scrollEventThrottle={16}
            />

            {/* 오른쪽 페이드 효과 */}
            {firstRow.length > 2 && (
              <LinearGradient
                colors={['transparent', 'rgba(249, 250, 251, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rightFade}
                pointerEvents="none"
              />
            )}

            {/* 스크롤 힌트 애니메이션 */}
            {showScrollHint && firstRow.length > 2 && (
              <Animated.View
                style={[
                  styles.scrollHint,
                  {
                    opacity: scrollHintAnim,
                    transform: [
                      {
                        translateX: scrollHintAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [-5, 0],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <MaterialCommunityIcons name="chevron-right" size={32} color="#6B46C1" />
              </Animated.View>
            )}
          </View>

          {/* 두 번째 행 */}
          {secondRow.length > 0 && (
            <View style={styles.rowWrapper}>
              <FlatList
                ref={secondRowRef}
                horizontal
                data={secondRow}
                renderItem={isLoading ? renderSkeleton : renderCounselor}
                keyExtractor={(item, index) =>
                  isLoading ? `skeleton-row2-${index}` : `favorite-row2-${item.id}`
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rowContent}
                onScroll={() => setShowScrollHint(false)}
                scrollEventThrottle={16}
              />

              {/* 오른쪽 페이드 효과 */}
              {secondRow.length > 2 && (
                <LinearGradient
                  colors={['transparent', 'rgba(249, 250, 251, 0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.rightFade}
                  pointerEvents="none"
                />
              )}

              {/* 스크롤 힌트 애니메이션 */}
              {showScrollHint && secondRow.length > 2 && (
                <Animated.View
                  style={[
                    styles.scrollHint,
                    {
                      opacity: scrollHintAnim,
                      transform: [
                        {
                          translateX: scrollHintAnim.interpolate({
                            inputRange: [0.3, 1],
                            outputRange: [-5, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                  pointerEvents="none"
                >
                  <MaterialCommunityIcons name="chevron-right" size={32} color="#EC4899" />
                </Animated.View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
    marginBottom: spacing.xs,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  rowsContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  rowWrapper: {
    height: '50%',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  rowContent: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    alignItems: 'center',
  },
  cardContainer: {
    marginRight: spacing.sm,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 1,
  },
  scrollHint: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -16,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#374151',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  browseButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#FFFFFF',
  },
});
