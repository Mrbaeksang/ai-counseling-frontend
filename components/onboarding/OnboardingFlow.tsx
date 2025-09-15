import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button, Text } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { spacing } from '@/constants/theme';
import type { IconName } from '@/types/icons';

interface SlideItem {
  key: string;
  title: string;
  text: string;
  icon: string;
  colors: [string, string];
}

const slides: SlideItem[] = [
  {
    key: 'welcome',
    title: '당신의 이야기를 들어드립니다',
    text: 'AI 전문 상담사가\n언제든 편하게 대화해드려요',
    icon: 'heart-pulse',
    colors: ['#8B5CF6', '#EC4899'],
  },
  {
    key: 'counselors',
    title: '다양한 관점의 상담',
    text: '연애, 직장, 인간관계, 자기계발\n고민별로 최적의 상담사를 만나보세요',
    icon: 'account-group',
    colors: ['#6366F1', '#8B5CF6'],
  },
  {
    key: 'privacy',
    title: '나만 볼 수 있는 대화',
    text: '모든 상담 내용은 비밀 보장\n원할 때 언제든 삭제 가능해요',
    icon: 'shield-check',
    colors: ['#10B981', '#3B82F6'],
  },
  {
    key: 'start',
    title: '지금 무료로 시작',
    text: '회원가입 없이 소셜 로그인만으로\n바로 무료 상담을 받아보세요',
    icon: 'rocket-launch',
    colors: ['#F97316', '#EC4899'],
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = React.memo(({ onComplete }: OnboardingFlowProps) => {
  const sliderRef = useRef<AppIntroSlider<SlideItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastClickTime = useRef(0);

  const renderItem = useCallback(
    ({ item, index }: { item: SlideItem; index: number }) => {
      const isActive = index === currentIndex;

      return (
        <LinearGradient colors={item.colors} style={styles.slide}>
          <View style={styles.content}>
            <Animated.View
              entering={isActive ? FadeInDown.delay(200).springify() : undefined}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons name={item.icon as IconName} size={120} color="white" />
            </Animated.View>

            <Animated.Text
              entering={isActive ? FadeInUp.delay(400).springify() : undefined}
              style={styles.title}
            >
              {item.title}
            </Animated.Text>

            <Animated.Text
              entering={isActive ? FadeInUp.delay(600).springify() : undefined}
              style={styles.text}
            >
              {item.text}
            </Animated.Text>
          </View>
        </LinearGradient>
      );
    },
    [currentIndex],
  );

  const handleNext = useCallback(() => {
    const now = Date.now();

    // 300ms 이내 중복 클릭 방지 (더 강력한 debounce)
    if (now - lastClickTime.current < 300) {
      return;
    }

    lastClickTime.current = now;
    setIsTransitioning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 즉시 상태 업데이트 후 슬라이드 호출
    const nextIndex = currentIndex + 1;

    // requestAnimationFrame으로 다음 프레임에서 실행
    requestAnimationFrame(() => {
      setCurrentIndex(nextIndex);
      sliderRef.current?.goToSlide(nextIndex);

      // 더 짧은 시간으로 다시 활성화
      setTimeout(() => setIsTransitioning(false), 150);
    });
  }, [currentIndex]);

  const renderNextButton = useCallback(() => {
    return (
      <AnimatedButton style={styles.button} onPress={handleNext} hapticStyle="light">
        <Text style={styles.buttonText}>다음</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
      </AnimatedButton>
    );
  }, [handleNext]);

  const handleComplete = useCallback(() => {
    if (isTransitioning) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  }, [onComplete, isTransitioning]);

  const renderDoneButton = useCallback(() => {
    return (
      <AnimatedButton
        style={[styles.button, styles.doneButton]}
        onPress={handleComplete}
        hapticStyle="medium"
        scaleTo={0.93}
      >
        <Text style={styles.buttonText}>시작하기</Text>
        <MaterialCommunityIcons name="check" size={20} color="white" />
      </AnimatedButton>
    );
  }, [handleComplete]);

  const handleSkip = useCallback(() => {
    if (isTransitioning) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete();
  }, [onComplete, isTransitioning]);

  const renderSkipButton = useCallback(() => {
    return (
      <Button mode="text" onPress={handleSkip} textColor="rgba(255,255,255,0.7)" compact>
        건너뛰기
      </Button>
    );
  }, [handleSkip]);

  const handleSlideChange = useCallback((index: number) => {
    // 스와이프로 변경된 경우에만 currentIndex 업데이트
    setCurrentIndex(index);
    // 슬라이드 변경 완료 후 즉시 버튼 활성화
    setIsTransitioning(false);
  }, []);

  return (
    <AppIntroSlider
      ref={sliderRef}
      data={slides}
      renderItem={renderItem}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      renderSkipButton={renderSkipButton}
      showSkipButton
      onSlideChange={handleSlideChange}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
});

OnboardingFlow.displayName = 'OnboardingFlow';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: 'white',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    marginRight: spacing.lg,
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
});
