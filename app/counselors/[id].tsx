import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Chip, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translateCategory } from '@/constants/categories';
import { spacing } from '@/constants/theme';
import { useCounselorDetail } from '@/hooks/useCounselors';
import { startSession } from '@/services/sessions';
import useAuthStore from '@/store/authStore';

// 상담사 이미지 매핑
const counselorImages: { [key: string]: ReturnType<typeof require> } = {
  'freud.jpg': require('@/assets/counselors/freud.jpg'),
  'jung.jpg': require('@/assets/counselors/jung.jpg'),
  'frankl.jpg': require('@/assets/counselors/frankl.jpg'),
  'socrates.jpg': require('@/assets/counselors/socrates.jpg'),
  'nietzsche.jpg': require('@/assets/counselors/nietzsche.jpg'),
  'kierkegaard.jpg': require('@/assets/counselors/kierkegaard.jpg'),
  'sartre.jpg': require('@/assets/counselors/sartre.jpg'),
  'confucius.jpg': require('@/assets/counselors/confucius.jpg'),
  'adler.jpg': require('@/assets/counselors/adler.jpg'),
  'carnegie.jpg': require('@/assets/counselors/carnegie.jpg'),
  'casanova.jpg': require('@/assets/counselors/casanova.jpg'),
  'ovid.jpg': require('@/assets/counselors/ovid.jpg'),
  'stendhal.jpg': require('@/assets/counselors/stendhal.jpg'),
  'aristotle.jpg': require('@/assets/counselors/aristotle.jpg'),
  'kant.jpg': require('@/assets/counselors/kant.jpg'),
  'buddha.jpg': require('@/assets/counselors/buddha.jpg'),
  'laozi.jpg': require('@/assets/counselors/laozi.jpg'),
};

export default function CounselorDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();

  const counselorId = Number(params.id);
  const [starting, setStarting] = useState(false);

  // React Query 훅 사용
  const { data: counselor, isLoading } = useCounselorDetail(counselorId);

  const handleStartSession = async () => {
    if (!user) {
      // 로그인 필요
      router.push('/login');
      return;
    }

    try {
      setStarting(true);
      const session = await startSession(counselorId);
      // 세션 화면으로 이동
      router.replace(`/session/${session.id}`);
    } catch (_error) {
    } finally {
      setStarting(false);
    }
  };

  const getImageSource = () => {
    if (!counselor?.avatarUrl) return null;
    const imageName = counselor.avatarUrl.split('/').pop();
    return imageName && counselorImages[imageName];
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  if (!counselor) {
    return (
      <View style={[styles.container, styles.errorContainer, { paddingTop: insets.top }]}>
        <Text>상담사 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const imageSource = getImageSource();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 섹션 */}
        <LinearGradient
          colors={['#6B46C1', '#9333EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            {imageSource ? (
              <Image source={imageSource} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{counselor.name.substring(0, 2)}</Text>
              </View>
            )}

            <Text style={styles.name}>{counselor.name}</Text>
            <Text style={styles.title}>{counselor.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={16} color="#FCD34D" />
                <Text style={styles.statText}>
                  {counselor.averageRating > 0 ? (counselor.averageRating / 10).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.statSubtext}>({counselor.totalRatings || 0})</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="message-text" size={16} color="white" />
                <Text style={styles.statText}>{counselor.totalSessions.toLocaleString()}</Text>
                <Text style={styles.statSubtext}>상담</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 컨텐츠 섹션 */}
        <View style={styles.content}>
          {/* 소개 */}
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>소개</Text>
            <Text style={styles.description}>
              {counselor.description || '철학적 상담을 통해 삶의 지혜를 나눕니다.'}
            </Text>
          </Surface>

          {/* 카테고리 */}
          {counselor.categories && (
            <Surface style={styles.section}>
              <Text style={styles.sectionTitle}>전문 분야</Text>
              <View style={styles.categoryContainer}>
                {counselor.categories.split(',').map((category) => (
                  <Chip
                    key={category}
                    mode="flat"
                    style={styles.categoryChip}
                    textStyle={styles.categoryChipText}
                  >
                    {translateCategory(category.trim())}
                  </Chip>
                ))}
              </View>
            </Surface>
          )}

          {/* 상담 방식 */}
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>상담 방식</Text>

            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="numeric-1-circle" size={20} color="#6B46C1" />
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>먼저 편안한 대화로 시작해요</Text>
                <Text style={styles.methodSubtext}>
                  신뢰 관계를 만들고 오늘의 고민을 들어봅니다
                </Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="numeric-2-circle" size={20} color="#6B46C1" />
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>마음속 이야기를 깊이 탐색해요</Text>
                <Text style={styles.methodSubtext}>감정과 경험을 천천히 들여다봅니다</Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="numeric-3-circle" size={20} color="#6B46C1" />
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>철학적 통찰로 새로운 시각을 제시해요</Text>
                <Text style={styles.methodSubtext}>자기 이해와 깨달음의 순간을 만들어갑니다</Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="numeric-4-circle" size={20} color="#6B46C1" />
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>작은 변화부터 함께 계획해요</Text>
                <Text style={styles.methodSubtext}>실천 가능한 구체적인 방법을 찾아봅니다</Text>
              </View>
            </View>

            <View style={styles.methodItem}>
              <MaterialCommunityIcons name="numeric-5-circle" size={20} color="#6B46C1" />
              <View style={styles.methodTextContainer}>
                <Text style={styles.methodText}>오늘의 대화를 따뜻하게 마무리해요</Text>
                <Text style={styles.methodSubtext}>성장의 씨앗을 품고 돌아갈 수 있도록</Text>
              </View>
            </View>
          </Surface>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          mode="contained"
          onPress={handleStartSession}
          loading={starting}
          disabled={starting}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
        >
          상담 시작하기
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  section: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: spacing.md,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    backgroundColor: '#F3E8FF',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#6B46C1',
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  startButton: {
    borderRadius: 12,
    backgroundColor: '#6B46C1',
  },
  startButtonContent: {
    height: 52,
  },
  startButtonLabel: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
});
