import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chip, Divider, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CounselorCard } from '@/components/counselor/CounselorCard';
import { CounselorCardSkeleton } from '@/components/counselor/CounselorCardSkeleton';
import { FavoriteCounselorCard } from '@/components/counselor/FavoriteCounselorCard';
import { spacing } from '@/constants/theme';
import { useCounselors, useFavoriteCounselors, useToggleFavorite } from '@/hooks/useCounselors';
import { useThrottle } from '@/hooks/useDebounce';
import type { Counselor } from '@/services/counselors/types';
import useAuthStore from '@/store/authStore';

// 카테고리 타입 정의
type CategoryType = {
  id: string;
  label: string;
  icon: string;
  color: string;
  gradient: [string, string];
};

// 카테고리 정의 (12개) - 백엔드 InitDataConfig와 일치
const CATEGORIES: CategoryType[] = [
  {
    id: 'self',
    label: '자기이해·자존감',
    icon: 'head-dots-horizontal',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#A78BFA'],
  },
  {
    id: 'emotion',
    label: '감정·정서',
    icon: 'emoticon-neutral',
    color: '#EC4899',
    gradient: ['#EC4899', '#F9A8D4'],
  },
  {
    id: 'anxiety',
    label: '불안',
    icon: 'alert-circle',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FCD34D'],
  },
  {
    id: 'depression',
    label: '우울',
    icon: 'weather-cloudy',
    color: '#6B7280',
    gradient: ['#6B7280', '#9CA3AF'],
  },
  {
    id: 'stress',
    label: '스트레스·번아웃',
    icon: 'lightning-bolt',
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'],
  },
  {
    id: 'trauma',
    label: '트라우마·상실',
    icon: 'bandage',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'relationship',
    label: '관계·연애',
    icon: 'heart-multiple',
    color: '#F472B6',
    gradient: ['#F472B6', '#FBCFE8'],
  },
  {
    id: 'family',
    label: '가족·양육',
    icon: 'home-heart',
    color: '#10B981',
    gradient: ['#10B981', '#6EE7B7'],
  },
  {
    id: 'life',
    label: '학업·진로',
    icon: 'school',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#93C5FD'],
  },
  {
    id: 'work',
    label: '직장·업무',
    icon: 'briefcase',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#38BDF8'],
  },
  {
    id: 'finance',
    label: '돈·경제',
    icon: 'cash-multiple',
    color: '#14B8A6',
    gradient: ['#14B8A6', '#2DD4BF'],
  },
  {
    id: 'habit',
    label: '습관·중독·수면',
    icon: 'sync-circle',
    color: '#A855F7',
    gradient: ['#A855F7', '#C084FC'],
  },
];

// 메인 화면에 표시할 카테고리 (처음 6개)
const MAIN_CATEGORIES = CATEGORIES.slice(0, 6);

// 전체 카테고리 (더보기에서 표시)
const ALL_CATEGORIES = CATEGORIES;

// 시간대별 인사말
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '편안한 새벽이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 17) return '오후도 화이팅';
  if (hour < 21) return '저녁 시간이네요';
  return '오늘 하루도 수고하셨어요';
};

const getSubGreeting = () => {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  if (day === 0 || day === 6) {
    // 주말
    return '주말에도 함께해요. 무엇을 도와드릴까요?';
  }

  if (hour < 6) return '잠이 안 오시나요? 편하게 이야기해요';
  if (hour < 9) return '오늘 하루를 시작하며 마음을 나눠요';
  if (hour < 12) return '어떤 고민이 있으신가요?';
  if (hour < 14) return '점심은 드셨나요? 잠시 쉬면서 대화해요';
  if (hour < 18) return '오후의 피로, 함께 풀어봐요';
  if (hour < 21) return '하루를 마무리하며 마음을 정리해요';
  return '오늘 있었던 일, 편하게 들려주세요';
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // 정렬 옵션 매핑 (백엔드 정렬 옵션: popular, rating, recent)
  const sortMap = {
    latest: 'recent',
    popular: 'popular',
    rating: 'rating',
  };

  // React Query hooks
  const {
    data: counselorsData,
    isLoading,
    refetch: refetchCounselors,
  } = useCounselors(1, 20, sortMap[sortBy]);
  const { data: favoritesData, refetch: refetchFavorites } = useFavoriteCounselors(1, 10);
  const { toggle: toggleFavorite } = useToggleFavorite();

  // 상담사 목록
  const counselors = counselorsData?.content || [];

  // 즐겨찾기 목록 및 ID 세트
  const favoriteCounselors = favoritesData?.content || [];
  const favoriteIds = new Set(favoriteCounselors.map((c) => c.id));

  const handleRefresh = async () => {
    await Promise.all([refetchCounselors(), refetchFavorites()]);
  };

  const handleToggleFavorite = (counselor: Counselor) => {
    // 로그인 여부 확인
    if (!user) {
      // TODO: 로그인 화면으로 이동
      return;
    }

    toggleFavorite(counselor.id, favoriteIds.has(counselor.id));
  };

  // 카테고리 네비게이션 함수 쓰로틀 적용
  const handleCategoryPressRaw = (categoryId: string) => {
    router.push(`/counselors/category?category=${categoryId}`);
  };

  const [handleCategoryPress] = useThrottle(
    handleCategoryPressRaw as (...args: unknown[]) => unknown,
    1000,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={counselors}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <>
            {/* 웰컴 메시지 */}
            <LinearGradient
              colors={['#F3E8FF', '#FDF4FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeSection}
            >
              <Text style={styles.welcomeText}>
                {getGreeting()}, {user?.nickname || '사용자'}님
              </Text>
              <Text style={styles.welcomeSubtext}>{getSubGreeting()}</Text>
            </LinearGradient>

            {/* 카테고리 섹션 */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>무엇이 가장 힘드신가요?</Text>
              <Text style={styles.categorySubtitle}>고민에 맞는 철학자를 찾아드려요</Text>

              <View style={styles.categoryContainer}>
                {/* 메인 카테고리 그리드 (6개) */}
                <View style={styles.categoryGrid}>
                  {MAIN_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => handleCategoryPress(category.id)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={category.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.categoryGradient}
                      >
                        <MaterialCommunityIcons
                          name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={26}
                          color="white"
                        />
                      </LinearGradient>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 더보기 버튼 - 전체 너비로 */}
                {!showAllCategories && (
                  <TouchableOpacity
                    style={styles.moreButtonFull}
                    onPress={() => setShowAllCategories(true)}
                  >
                    <Text style={styles.moreButtonText}>더 많은 카테고리 보기</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}

                {/* 추가 카테고리 (12개) - 확장 시 표시 */}
                {showAllCategories && (
                  <>
                    <View style={styles.categoryGrid}>
                      {ALL_CATEGORIES.slice(6).map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={styles.categoryCard}
                          onPress={() => {
                            setShowAllCategories(false);
                            handleCategoryPress(category.id);
                          }}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={category.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.categoryGradient}
                          >
                            <MaterialCommunityIcons
                              name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                              size={26}
                              color="white"
                            />
                          </LinearGradient>
                          <Text style={styles.categoryLabel}>{category.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* 접기 버튼 */}
                    <TouchableOpacity
                      style={styles.collapseButton}
                      onPress={() => setShowAllCategories(false)}
                    >
                      <Text style={styles.collapseButtonText}>접기</Text>
                      <MaterialCommunityIcons name="chevron-up" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* 즐겨찾기 상담사 섹션 */}
            {favoriteCounselors.length > 0 ? (
              <View style={styles.favoriteSection}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="heart" size={20} color="#EF4444" />
                  <Text style={styles.sectionTitle}>즐겨찾는 상담사</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.favoriteList}
                >
                  {favoriteCounselors.map((counselor) => (
                    <FavoriteCounselorCard key={counselor.id} counselor={counselor} />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <Divider style={styles.divider} />

            {/* 전체 상담사 섹션 헤더 */}
            <View style={styles.allCounselorsHeader}>
              <Text style={styles.sectionTitle}>모든 상담사</Text>
              <View style={styles.sortChips}>
                <Chip
                  mode={sortBy === 'latest' ? 'flat' : 'outlined'}
                  onPress={() => setSortBy('latest')}
                  style={styles.sortChip}
                >
                  최신순
                </Chip>
                <Chip
                  mode={sortBy === 'popular' ? 'flat' : 'outlined'}
                  onPress={() => setSortBy('popular')}
                  style={styles.sortChip}
                >
                  인기순
                </Chip>
                <Chip
                  mode={sortBy === 'rating' ? 'flat' : 'outlined'}
                  onPress={() => setSortBy('rating')}
                  style={styles.sortChip}
                >
                  평점순
                </Chip>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <CounselorCard
            counselor={item}
            isFavorite={favoriteIds.has(item.id)}
            onFavoriteToggle={() => handleToggleFavorite(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <CounselorCardSkeleton key={i} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <LinearGradient
                colors={['#F3E8FF', '#EDE9FE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyIconContainer}
              >
                <MaterialCommunityIcons name="account-group-outline" size={32} color="#6B46C1" />
              </LinearGradient>
              <Text style={styles.emptyText}>상담사가 없습니다</Text>
              <Text style={styles.emptySubtext}>다른 카테고리를 선택해보세요</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  welcomeSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
  },
  welcomeSubtext: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    marginTop: spacing.xs,
  },
  favoriteSection: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
  },
  favoriteList: {
    paddingHorizontal: spacing.lg,
  },
  divider: {
    marginVertical: spacing.lg,
    backgroundColor: '#E5E7EB',
  },
  allCounselorsHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sortChips: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  sortChip: {
    height: 32,
  },
  sortChipText: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    marginTop: spacing.md,
  },
  emptyContainer: {
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    color: '#111827',
    marginTop: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    marginTop: spacing.xs,
  },
  categorySection: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  categorySubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoryContainer: {
    paddingHorizontal: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: spacing.md,
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard-Medium',
    color: '#374151',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  moreButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: spacing.xs,
  },
  moreButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    gap: spacing.xs,
  },
  collapseButtonText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
});
