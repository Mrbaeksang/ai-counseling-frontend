import { router } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { DailyQuote } from '@/components/home/DailyQuote';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { spacing } from '@/constants/theme';
import useAuthStore from '@/store/authStore';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const theme = useTheme();

  // 카테고리 클릭 핸들러 - Characters 탭으로 네비게이션
  const handleCategoryPress = useCallback((categoryId: string) => {
    // Characters 탭으로 이동하면서 카테고리 전달
    router.push({
      pathname: '/(tabs)/characters',
      params: {
        selectedCategory: categoryId,
      },
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <WelcomeSection userName={user?.nickname} />
        <DailyQuote />

        {/* 카테고리 그리드 - Characters 탭으로 네비게이션 */}
        <CategoryGrid onCategoryPress={handleCategoryPress} selectedCategories={new Set()} />

        {/* 추가 컨텐츠 영역 - 향후 기능 추가 예정 */}
        <View style={styles.additionalContent}>
          <View style={styles.infoSection}>
            <Text style={[styles.infoTitle, { color: theme.colors.onSurface }]}>
              AI 캐릭터 탐색하기
            </Text>
            <Text style={[styles.infoDescription, { color: theme.colors.onSurfaceVariant }]}>
              상단의 카테고리를 선택하거나 하단 탭의 '캐릭터'를 눌러{'\n'}
              다양한 AI 상담사를 만나보세요
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  additionalContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    marginBottom: spacing.sm,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});
