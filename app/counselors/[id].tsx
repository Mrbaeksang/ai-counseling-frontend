import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginPromptDialog } from '@/components/common/LoginPromptDialog';
import { CategorySection } from '@/components/counselor/CategorySection';
import { CounselingMethod } from '@/components/counselor/CounselingMethod';
import { ProfileHeader } from '@/components/counselor/ProfileHeader';
import { spacing } from '@/constants/theme';
import { useCounselorDetail } from '@/hooks/useCounselors';
import { useStartSession } from '@/hooks/useStartSession';
import useAuthStore from '@/store/authStore';

export default function CounselorDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const counselorId = Number(params.id);

  // React Query 훅 사용
  const { data: counselor, isLoading } = useCounselorDetail(counselorId);
  const startSessionMutation = useStartSession();

  const handleStartSession = useCallback(async () => {
    if (!user) {
      // 로그인 유도 다이얼로그 표시
      setShowLoginDialog(true);
      return;
    }

    try {
      const response = await startSessionMutation.mutateAsync({ counselorId });
      // 세션 화면으로 이동 (백엔드 응답의 counselorId 사용)
      router.replace({
        pathname: `/session/${response.sessionId}`,
        params: {
          counselorId: response.counselorId.toString(),
          counselorName: response.counselorName,
          title: response.title,
          avatarUrl: response.avatarUrl || '',
          isBookmarked: 'false', // 새 세션은 항상 북마크되지 않은 상태
        },
      });
    } catch (_error: unknown) {}
  }, [user, counselorId, startSessionMutation]);

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 섹션 */}
        <ProfileHeader counselor={counselor} />

        {/* 컨텐츠 섹션 */}
        <View style={styles.content}>
          {/* 소개 */}
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>소개</Text>
            <Text style={styles.description}>
              {counselor.description || '따뜻한 상담을 통해 삶의 지혜를 나눕니다.'}
            </Text>
          </Surface>

          {/* 카테고리 */}
          <CategorySection categories={counselor.categories} />

          {/* 상담 방식 */}
          <CounselingMethod />
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          mode="contained"
          onPress={handleStartSession}
          loading={startSessionMutation.isPending}
          disabled={startSessionMutation.isPending}
          buttonColor="#6B46C1"
          textColor="white"
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
          labelStyle={styles.startButtonLabel}
        >
          상담 시작하기
        </Button>
      </View>

      {/* 로그인 유도 다이얼로그 */}
      <LoginPromptDialog
        visible={showLoginDialog}
        onDismiss={() => setShowLoginDialog(false)}
        title="상담을 시작하려면 로그인이 필요해요"
        description="3초만에 로그인하고\n개인 맞춤 상담을 받아보세요! ✨"
      />
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
