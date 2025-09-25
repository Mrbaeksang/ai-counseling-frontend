import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface WelcomeSectionProps {
  userName?: string;
}

const getGreetingByTime = () => {
  const hour = new Date().getHours();

  if (hour < 6) return '조용한 새벽, 마인드톡과 마음을 가볍게 만들어 보세요.';
  if (hour < 12) return '아침 기분을 채우는 힐링 토크 한 잔 어떠세요?';
  if (hour < 18) return '하루 한 번, 가볍게 이야기 나누며 쉬어 가요.';
  return '오늘 있었던 일, 마인드톡에게 털어놓으며 마무리해요.';
};

export function WelcomeSection({ userName }: WelcomeSectionProps) {
  const greeting = getGreetingByTime();

  return (
    <LinearGradient
      colors={['#6B46C1', '#9333EA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeSection}
    >
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeLabel}>
          {userName
            ? `${userName}님, 마인드톡에 오신 걸 환영해요`
            : '마인드톡과 즐거운 대화를 시작해요'}
        </Text>
        <Text style={styles.welcomeMessage}>{greeting}</Text>
        <Text style={styles.welcomeSubtext}>
          마인드톡은 엔터테인먼트를 위한 가상 대화 공간이에요. AI가 자동으로 이야기를 만들어서
          때때로 엉뚱한 답이 나올 수 있다는 점만 기억해 주세요.
        </Text>
      </View>

      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    margin: spacing.lg,
    borderRadius: 20,
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#6B46C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeContent: {
    position: 'relative',
    zIndex: 1,
  },
  welcomeLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.xs,
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    lineHeight: 30,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -40,
    right: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
});
