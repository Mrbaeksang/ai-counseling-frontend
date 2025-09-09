import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CounselorCard } from '@/components/counselor/CounselorCard';
import { spacing } from '@/constants/theme';
import { getCounselors } from '@/services/counselors';
import type { Counselor } from '@/services/counselors/types';
import useAuthStore from '@/store/authStore';

// 카테고리 ID를 한글 라벨로 매핑 - 백엔드 InitDataConfig와 일치
const CATEGORY_MAP: { [key: string]: string } = {
  self: '자아탐구',
  relationship: '대인관계',
  romance: '연애',
  mental: '정신건강',
  study: '학업',
  work: '업무',
  family: '가족',
  life: '인생',
  anxiety: '불안',
  stress: '스트레스',
  trauma: '트라우마',
  'self-esteem': '자존감',
  emotion: '감정',
};

// 카테고리별 그라데이션 색상
const CATEGORY_COLORS: { [key: string]: string[] } = {
  self: ['#8B5CF6', '#A78BFA'],
  relationship: ['#EC4899', '#F9A8D4'],
  romance: ['#EF4444', '#FCA5A5'],
  mental: ['#3B82F6', '#93C5FD'],
  study: ['#10B981', '#6EE7B7'],
  work: ['#F59E0B', '#FCD34D'],
  family: ['#F97316', '#FDBA74'],
  life: ['#6B46C1', '#9333EA'],
  anxiety: ['#6366F1', '#A5B4FC'],
  stress: ['#6366F1', '#A5B4FC'],
  trauma: ['#DC2626', '#F87171'],
  'self-esteem': ['#14B8A6', '#5EEAD4'],
  anger: ['#EF4444', '#FCA5A5'],
  depression: ['#64748B', '#CBD5E1'],
  addiction: ['#7C3AED', '#A78BFA'],
  eating: ['#059669', '#34D399'],
  sleep: ['#4F46E5', '#818CF8'],
  sexual: ['#BE185D', '#EC4899'],
  parenting: ['#0891B2', '#67E8F9'],
};

export default function CategoryCounselorsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();

  const categoryId = params.category as string;
  const categoryLabel = CATEGORY_MAP[categoryId] || categoryId;
  const categoryColors = (CATEGORY_COLORS[categoryId] || ['#6B46C1', '#9333EA']) as [
    string,
    string,
  ];

  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, _setFavoriteIds] = useState<Set<number>>(new Set());

  const loadCounselors = useCallback(async () => {
    try {
      setLoading(true);

      // 모든 상담사를 가져온 후 프론트엔드에서 필터링
      const response = await getCounselors(1, 100, 'recent');

      if (response?.content) {
        // 카테고리로 필터링
        const filtered = response.content.filter((counselor) => {
          if (!counselor.categories) return false;
          const categories = counselor.categories
            .toLowerCase()
            .split(',')
            .map((c: string) => c.trim());

          // 카테고리 매칭 로직 - 백엔드 InitDataConfig와 일치 (영어로 저장됨)
          return categories.includes(categoryId);
        });

        setCounselors(filtered);
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCounselors();
  }, [loadCounselors]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCounselors();
    setRefreshing(false);
  };

  const toggleFavorite = async (_counselor: Counselor) => {
    if (!user) {
      return;
    }
    // TODO: 즐겨찾기 토글 구현
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* 헤더 */}
        <LinearGradient
          colors={categoryColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{categoryLabel}</Text>
              <Text style={styles.headerSubtitle}>전문 상담사를 만나보세요</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 상담사 목록 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6B46C1" />
          </View>
        ) : counselors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>해당 카테고리의 상담사가 없습니다</Text>
            <Text style={styles.emptySubtext}>다른 카테고리를 선택해보세요</Text>
          </View>
        ) : (
          <FlatList
            data={counselors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CounselorCard
                counselor={item}
                isFavorite={favoriteIds.has(item.id)}
                onFavoriteToggle={() => toggleFavorite(item)}
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <Surface style={styles.resultInfo}>
                <Text style={styles.resultText}>{counselors.length}명의 전문 상담사</Text>
              </Surface>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#4B5563',
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#9CA3AF',
    marginTop: spacing.xs,
  },
  listContainer: {
    paddingBottom: spacing.xl,
  },
  resultInfo: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 1,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  separator: {
    height: spacing.xs,
  },
});
