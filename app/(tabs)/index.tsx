import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, shadows, spacing } from '@/constants/theme';
import useAuthStore from '@/store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CounselorCard {
  id: string;
  name: string;
  specialty: string;
  icon: string;
  color: string;
  description: string;
}

const counselors: CounselorCard[] = [
  {
    id: '1',
    name: '마음 친구',
    specialty: '일상 상담',
    icon: 'heart',
    color: '#EC4899',
    description: '일상의 고민을 편하게 나눌 수 있는 따뜻한 친구',
  },
  {
    id: '2',
    name: '철학 멘토',
    specialty: '철학 상담',
    icon: 'book-open-variant',
    color: '#6366F1',
    description: '삶의 의미와 방향을 함께 탐구하는 철학적 동반자',
  },
  {
    id: '3',
    name: '성장 코치',
    specialty: '자기계발',
    icon: 'trending-up',
    color: '#10B981',
    description: '목표 달성과 성장을 위한 전문 코칭',
  },
  {
    id: '4',
    name: '힐링 가이드',
    specialty: '스트레스 관리',
    icon: 'spa',
    color: '#F59E0B',
    description: '마음의 평화와 휴식을 찾도록 돕는 가이드',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleCounselorPress = (counselor: CounselorCard) => {
    router.push({
      pathname: '/session/[id]',
      params: { id: counselor.id },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* 헤더 섹션 */}
          <View style={styles.header}>
            <Text style={styles.greeting}>안녕하세요{user?.name ? `, ${user.name}님` : ''} 👋</Text>
            <Text style={styles.subtitle}>오늘은 어떤 이야기를 나누고 싶으신가요?</Text>
          </View>

          {/* 빠른 시작 카드 */}
          <Pressable
            style={({ pressed }) => [styles.quickStartCard, pressed && styles.cardPressed]}
            onPress={() => handleCounselorPress(counselors[0])}
          >
            <View style={styles.quickStartContent}>
              <View style={styles.quickStartTextContainer}>
                <Text style={styles.quickStartTitle}>빠른 상담 시작</Text>
                <Text style={styles.quickStartDescription}>
                  AI 상담사와 바로 대화를 시작해보세요
                </Text>
              </View>
              <View style={[styles.quickStartIcon, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="message-text" size={24} color="#EF4444" />
              </View>
            </View>
          </Pressable>

          {/* 상담사 목록 */}
          <View style={styles.counselorsSection}>
            <Text style={styles.sectionTitle}>AI 상담사 선택</Text>
            <View style={styles.counselorsGrid}>
              {counselors.map((counselor, _index) => (
                <Pressable
                  key={counselor.id}
                  style={({ pressed }) => [styles.counselorCard, pressed && styles.cardPressed]}
                  onPress={() => handleCounselorPress(counselor)}
                >
                  <View style={[styles.counselorIcon, { backgroundColor: `${counselor.color}15` }]}>
                    <MaterialCommunityIcons
                      name={counselor.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={28}
                      color={counselor.color}
                    />
                  </View>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <Text style={styles.counselorSpecialty}>{counselor.specialty}</Text>
                  <Text style={styles.counselorDescription} numberOfLines={2}>
                    {counselor.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 통계 카드 */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>총 상담</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>이번 주</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>연속 일수</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  quickStartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickStartTextContainer: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickStartDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  quickStartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  counselorsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: spacing.md,
  },
  counselorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  counselorCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 2) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.xs,
    ...shadows.sm,
  },
  counselorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  counselorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  counselorSpecialty: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: spacing.xs,
  },
  counselorDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    marginHorizontal: -spacing.xs,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    alignItems: 'center',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
