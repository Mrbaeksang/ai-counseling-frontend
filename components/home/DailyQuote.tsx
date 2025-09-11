import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

// 따뜻하고 위로가 되는 명언들 (F유형을 위한)
const QUOTES = [
  {
    text: '괜찮아, 모든 것은 결국 잘 될 거야. 지금 이 순간도 과정일 뿐이야.',
    author: '무라카미 하루키',
  },
  { text: '당신은 이미 충분히 잘하고 있어요. 스스로를 믿어주세요.', author: '브레네 브라운' },
  {
    text: '완벽하지 않아도 괜찮아. 불완전함이 우리를 더 인간답게 만들어.',
    author: '엘리자베스 길버트',
  },
  { text: '힘들 때는 쉬어가도 돼. 그것도 앞으로 나아가는 방법이야.', author: '맷 헤이그' },
  {
    text: '네가 얼마나 소중한 사람인지 잊지 마. 세상은 너의 빛을 필요로 해.',
    author: '오프라 윈프리',
  },
  { text: '실패는 끝이 아니야. 새로운 시작을 위한 용기있는 선택이지.', author: '마야 안젤루' },
  { text: '너의 감정은 모두 타당해. 그것들을 부드럽게 안아줘.', author: '틱낫한' },
  { text: '오늘 하루도 수고했어. 그것만으로도 충분히 자랑스러워.', author: '글레넌 도일' },
  { text: '상처받은 마음도 시간이 지나면 아물어. 넌 생각보다 강해.', author: '루피 카우르' },
  {
    text: '네 속도대로 가도 괜찮아. 모두가 같은 시간표를 갖고 있지 않아.',
    author: '모건 하퍼 니콜스',
  },
  { text: '실수해도 괜찮아. 그게 바로 우리가 성장하는 방법이야.', author: '브라이언 트레이시' },
  { text: '너 자신에게 친절해져. 가장 오래 함께할 사람은 바로 너니까.', author: '루이스 헤이' },
  { text: '힘든 날도 있지만, 그런 날이 너를 더 강하게 만들어줄 거야.', author: '드레이크' },
  { text: '네가 지금 느끼는 감정, 그 모든 것이 괜찮아. 천천히 숨 쉬어.', author: '제이 셰티' },
  { text: '포기하지 마. 가장 어두운 밤이 지나면 해가 뜨니까.', author: '하비 맥케이' },
  { text: '너는 혼자가 아니야. 우리 모두 함께 걸어가고 있어.', author: '레이첼 브래튼' },
  { text: '작은 진전도 진전이야. 스스로를 축하해줘.', author: '멜 로빈스' },
  { text: '네 마음의 소리를 들어. 그것이 너를 올바른 길로 인도할 거야.', author: '파울로 코엘료' },
  { text: '오늘이 힘들었다면, 내일은 새로운 기회가 될 거야.', author: '앤 라모트' },
  {
    text: '너의 눈물도 소중해. 그것은 네가 깊이 느낄 수 있다는 증거야.',
    author: '니콜라스 스파크스',
  },
  { text: '완벽한 순간을 기다리지 마. 지금 이 순간을 완벽하게 만들어.', author: '제시카 심슨' },
  { text: '네가 있는 그대로도 충분히 아름다워. 변할 필요 없어.', author: '멜리사 맥카시' },
  { text: '힘들 때 울어도 돼. 눈물은 마음을 씻어주는 비야.', author: '워싱턴 어빙' },
  { text: '너는 생각보다 많은 사람들에게 영감을 주고 있어.', author: '미셸 오바마' },
  { text: '실패를 두려워하지 마. 그것은 성공으로 가는 디딤돌이야.', author: '아리아나 허핑턴' },
  { text: '네 페이스대로 가. 인생은 경주가 아니라 여행이야.', author: '라이언 홀리데이' },
  { text: '자신을 용서해. 우리는 모두 실수하며 배워가는 중이야.', author: '이드리스 엘바' },
  { text: '오늘 하루, 네가 웃을 수 있었다면 그것으로 충분해.', author: '테일러 스위프트' },
  { text: '네가 느끼는 모든 감정이 너를 더 풍부한 사람으로 만들어.', author: '셀레나 고메즈' },
  {
    text: '포옹이 필요할 때가 있어. 지금이 바로 그 순간이야. 스스로를 안아줘.',
    author: '레이디 가가',
  },
];

// 오늘의 날짜를 기반으로 명언 선택
const getTodayQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return QUOTES[dayOfYear % QUOTES.length];
};

export const DailyQuote = React.memo(() => {
  const todayQuote = useMemo(() => getTodayQuote(), []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F3E8FF', '#EDE9FE', '#E9D5FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* 장식용 아이콘들 */}
        <MaterialCommunityIcons
          name="format-quote-open"
          size={28}
          color="rgba(107, 70, 193, 0.15)"
          style={styles.quoteIconLeft}
        />
        <MaterialCommunityIcons
          name="format-quote-close"
          size={28}
          color="rgba(107, 70, 193, 0.15)"
          style={styles.quoteIconRight}
        />

        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#6B46C1" />
            <Text style={styles.title}>오늘의 명언</Text>
            <View style={styles.titleDot} />
            <Text style={styles.date}>
              {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* 명언 내용 */}
        <View style={styles.content}>
          <Text style={styles.quote}>{todayQuote.text}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.authorLine} />
            <Text style={styles.author}>{todayQuote.author}</Text>
            <View style={styles.authorLine} />
          </View>
        </View>

        {/* 하단 장식 */}
        <View style={styles.bottomDecoration}>
          <View style={styles.decorativeDot} />
          <View style={[styles.decorativeDot, styles.decorativeDotMiddle]} />
          <View style={styles.decorativeDot} />
        </View>
      </LinearGradient>
    </View>
  );
});

DailyQuote.displayName = 'DailyQuote';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  gradientCard: {
    borderRadius: 20,
    padding: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    // 그림자 효과
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  quoteIconLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    opacity: 0.3,
  },
  quoteIconRight: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    opacity: 0.3,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#6B46C1',
    letterSpacing: 0.5,
  },
  titleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A78BFA',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    color: '#8B5CF6',
    opacity: 0.8,
  },
  content: {
    paddingVertical: spacing.sm,
  },
  quote: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    color: '#4C1D95',
    lineHeight: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  authorLine: {
    height: 1,
    width: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  author: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  bottomDecoration: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  decorativeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
  },
  decorativeDotMiddle: {
    backgroundColor: 'rgba(139, 92, 246, 0.6)',
    transform: [{ scale: 1.2 }],
  },
});
