import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategorySection } from '@/components/character/CategorySection';
import { CounselingMethod } from '@/components/character/CounselingMethod';
import { ProfileHeader } from '@/components/character/ProfileHeader';
import { LoginPromptDialog } from '@/components/common/LoginPromptDialog';
import { spacing } from '@/constants/theme';
import { useCharacterDetail } from '@/hooks/useCharacters';
import { useStartSession } from '@/hooks/useStartSession';
import useAuthStore from '@/store/authStore';

export default function CharacterDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const characterId = Number(params.id);

  const { data: character, isLoading } = useCharacterDetail(characterId);
  const startSessionMutation = useStartSession();

  const handleStartSession = useCallback(async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const response = await startSessionMutation.mutateAsync({ characterId });
      router.replace({
        pathname: `/session/${response.sessionId}`,
        params: {
          characterId: response.characterId.toString(),
          characterName: response.characterName,
          title: response.title,
          avatarUrl: response.avatarUrl || '',
          isBookmarked: 'false',
        },
      });
    } catch (_error: unknown) {}
  }, [user, characterId, startSessionMutation]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={[styles.container, styles.errorContainer, { paddingTop: insets.top }]}>
        <Text>AI 캐릭터 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader character={character} />

        <Surface style={styles.noticeCard}>
          <View style={styles.noticeRow}>
            <View style={styles.noticeIcon}>
              <MaterialCommunityIcons name="robot-happy" size={20} color="#6B46C1" />
            </View>
            <View style={styles.noticeTexts}>
              <Text style={styles.noticeTitle}>AI 엔터테인먼트 안내</Text>
              <Text style={styles.noticeDescription}>
                마인드톡은 즐거운 이야기를 위한 서비스예요. AI가 자동으로 응답하므로 가끔 엉뚱한
                답이 나올 수 있고, 전문 상담이나 조언으로 사용하면 안 된다는 점만 기억해 주세요.
              </Text>
            </View>
          </View>
        </Surface>

        <View style={styles.content}>
          <Surface style={styles.section}>
            <Text style={styles.sectionTitle}>소개</Text>
            <Text style={styles.description}>
              {character.description ||
                '마인드톡 캐릭터와 편하게 이야기하며 마음을 가볍게 만들어 보세요.'}
            </Text>
          </Surface>

          <CategorySection categories={character.categories} />

          <CounselingMethod />
        </View>
      </ScrollView>

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
          광고 보고 대화 시작하기
        </Button>
      </View>

      <LoginPromptDialog
        visible={showLoginDialog}
        onDismiss={() => setShowLoginDialog(false)}
        title="대화를 시작하려면 로그인이 필요해요"
        description="3초 만에 로그인하고\n개인 맞춤 대화를 즐겨보세요! ✨"
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
  noticeCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    padding: spacing.lg,
    elevation: 0,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 70, 193, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  noticeTexts: {
    flex: 1,
    gap: spacing.xs,
  },
  noticeTitle: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
    color: '#4C1D95',
  },
  noticeDescription: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular',
    color: '#4B5563',
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
