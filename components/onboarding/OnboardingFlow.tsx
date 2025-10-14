import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button, Checkbox, Text } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { spacing } from '@/constants/theme';
import type { IconName } from '@/types/icons';

interface SlideItem {
  key: string;
  title: string;
  text: string;
  icon: string;
  colors: [string, string];
  consentDetails?: string[];
  requiresConsent?: boolean;
}

const slides: SlideItem[] = [
  {
    key: 'welcome',
    title: '마음이 가벼워지는 AI 토크',
    text: '가상 캐릭터와 가볍게 이야기 나누며\n감정을 정리하고 휴식할 수 있는 공간이에요.',
    icon: 'chat-processing',
    colors: ['#8B5CF6', '#EC4899'],
  },
  {
    key: 'characters',
    title: '스토리 기반 캐릭터와 대화',
    text: '다양한 캐릭터 시나리오를 따라가며\n취향에 맞는 힐링 토크를 즐겨 보세요.',
    icon: 'account-voice',
    colors: ['#6366F1', '#8B5CF6'],
  },
  {
    key: 'ai_content',
    title: 'AI가 만드는 엔터테인먼트',
    text: '대화 내용은 AI가 자동으로 생성돼요.\n즐거운 체험을 위한 콘텐츠로 제공됩니다.',
    icon: 'robot-happy',
    colors: ['#10B981', '#3B82F6'],
  },
  {
    key: 'start',
    title: '시작 전 안내를 확인해 주세요',
    text: '아래 내용을 읽고 동의해 주시면 바로 마인드톡을 이용할 수 있어요.',
    icon: 'clipboard-check',
    colors: ['#F97316', '#EC4899'],
    requiresConsent: true,
    consentDetails: [
      '이 앱은 의료·심리·법률 상담을 제공하지 않습니다.',
      'AI가 자동 생성한 응답으로 오류나 부정확한 표현이 포함될 수 있습니다.',
      '건강이나 안전과 관련된 문제는 반드시 전문 기관에 문의하세요.',
    ],
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = React.memo(({ onComplete }: OnboardingFlowProps) => {
  const sliderRef = useRef<AppIntroSlider<SlideItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const lastClickTime = useRef(0);

  const isConsentSlide = useMemo(
    () => slides[currentIndex]?.requiresConsent ?? false,
    [currentIndex],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: SlideItem; index: number }) => {
      const isActive = index === currentIndex;

      return (
        <LinearGradient colors={item.colors} style={styles.slide}>
          <View style={styles.safeArea}>
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

              {item.consentDetails && (
                <Animated.View
                  entering={isActive ? FadeInUp.delay(700).springify() : undefined}
                  style={styles.consentDetails}
                >
                  {item.consentDetails.map((detail) => (
                    <Text key={detail} style={styles.consentDetailText}>
                      {`• ${detail}`}
                    </Text>
                  ))}
                </Animated.View>
              )}

              {item.requiresConsent && (
                <Animated.View
                  entering={isActive ? FadeInUp.delay(800).springify() : undefined}
                  style={styles.consentCheckboxRow}
                >
                  <Checkbox
                    status={hasConsent ? 'checked' : 'unchecked'}
                    onPress={() => setHasConsent((prev) => !prev)}
                    color="white"
                    uncheckedColor="white"
                  />
                  <Text style={styles.consentCheckboxLabel}>
                    위 내용을 이해했고 엔터테인먼트 목적으로 이용할게요.
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        </LinearGradient>
      );
    },
    [currentIndex, hasConsent],
  );

  const handleNext = useCallback(() => {
    const now = Date.now();

    if (now - lastClickTime.current < 300) {
      return;
    }

    lastClickTime.current = now;
    setIsTransitioning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextIndex = currentIndex + 1;

    requestAnimationFrame(() => {
      setCurrentIndex(nextIndex);
      sliderRef.current?.goToSlide(nextIndex);
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
    if (slides[currentIndex]?.requiresConsent && !hasConsent) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  }, [currentIndex, hasConsent, isTransitioning, onComplete]);

  const renderDoneButton = useCallback(() => {
    const consentRequired = slides[currentIndex]?.requiresConsent ?? false;
    const disabled = consentRequired && !hasConsent;

    return (
      <AnimatedButton
        style={[styles.button, styles.doneButton, disabled ? styles.buttonDisabled : null]}
        onPress={handleComplete}
        hapticStyle="medium"
        scaleTo={0.93}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>시작할게요</Text>
        <MaterialCommunityIcons name="check" size={20} color="white" />
      </AnimatedButton>
    );
  }, [currentIndex, handleComplete, hasConsent]);

  const handleSkip = useCallback(() => {
    if (isTransitioning) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete();
  }, [isTransitioning, onComplete]);

  const renderSkipButton = useCallback(() => {
    if (slides[currentIndex]?.requiresConsent) {
      return null;
    }

    return (
      <Button mode="text" onPress={handleSkip} textColor="rgba(255,255,255,0.7)" compact>
        건너뛰기
      </Button>
    );
  }, [currentIndex, handleSkip]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsTransitioning(false);

    if (!slides[index]?.requiresConsent) {
      setHasConsent(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'bottom']}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        showSkipButton={!isConsentSlide}
        onSlideChange={handleSlideChange}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      />
    </SafeAreaView>
  );
});

OnboardingFlow.displayName = 'OnboardingFlow';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg, // 기본 하단 패딩
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
    marginBottom: spacing.xl,
  },
  consentDetails: {
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  consentDetailText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 22,
    textAlign: 'left',
  },
  consentCheckboxRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  consentCheckboxLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Pretendard-Medium',
    color: 'rgba(255, 255, 255, 0.95)',
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
    marginBottom: spacing.sm, // SafeAreaView가 하단 처리하므로 최소 여백만
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
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
