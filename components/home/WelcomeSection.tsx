import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface WelcomeSectionProps {
  userName?: string;
}

// 시간대별 인사말
const getGreetingByTime = () => {
  const hour = new Date().getHours();
  if (hour < 5) return '늦은 밤이네요. 잠이 안 오시나요?';
  if (hour < 8) return '이른 아침이네요. 상쾌한 하루 되세요';
  if (hour < 12) return '좋은 아침이에요! 오늘은 어떤 하루를 보내고 계신가요?';
  if (hour < 14) return '점심은 맛있게 드셨나요?';
  if (hour < 17) return '오후의 평온한 시간이네요';
  if (hour < 19) return '저녁 시간이 다가오네요';
  if (hour < 21) return '하루를 마무리하며 마음을 정리해요';
  return '오늘 있었던 일, 편하게 들려주세요';
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
        <Text style={styles.welcomeLabel}>안녕하세요{userName ? `, ${userName}님` : ''}</Text>
        <Text style={styles.welcomeMessage}>{greeting}</Text>
        <Text style={styles.welcomeSubtext}>
          오늘도 당신의 마음에 귀 기울이는 상담사들이 기다리고 있어요
        </Text>
      </View>

      {/* 장식 요소 */}
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
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
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
