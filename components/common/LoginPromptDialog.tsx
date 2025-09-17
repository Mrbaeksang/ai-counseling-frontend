import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface LoginPromptDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  description?: string;
}

export const LoginPromptDialog = React.memo(
  ({
    visible,
    onDismiss,
    title = '로그인이 필요해요',
    description: _description = '3초만에 로그인하고\n개인 맞춤 상담을 받아보세요! ✨',
  }: LoginPromptDialogProps) => {
    const theme = useTheme();

    const handleLogin = useCallback(() => {
      onDismiss();
      router.push('/(auth)/login');
    }, [onDismiss]);

    return (
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={onDismiss}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons
                name="lock-open-outline"
                size={32}
                color={theme.colors.primary}
              />
            </View>
          </View>

          <Dialog.Title style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Dialog.Title>

          <Dialog.Content>
            <View style={styles.descriptionContainer}>
              <Text style={[styles.description, { color: theme.colors.primary }]}>
                3초만에 로그인하고
              </Text>
              <Text style={[styles.description, { color: theme.colors.primary }]}>
                개인 맞춤 상담을 받아보세요! ✨
              </Text>
            </View>

            <View
              style={[styles.benefitsContainer, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <View style={styles.benefitRow}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.benefitText, { color: theme.colors.onSurfaceVariant }]}>
                  모든 상담사와 대화
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.benefitText, { color: theme.colors.onSurfaceVariant }]}>
                  상담 내역 저장
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={[styles.benefitText, { color: theme.colors.onSurfaceVariant }]}>
                  즐겨찾기 관리
                </Text>
              </View>
            </View>

            <View style={styles.providerContainer}>
              <Text style={[styles.providerTitle, { color: theme.colors.onSurfaceVariant }]}>
                간편 로그인
              </Text>
              <View style={styles.providerIcons}>
                <View style={[styles.providerIcon, { backgroundColor: '#4285F4' }]}>
                  <MaterialCommunityIcons name="google" size={20} color="white" />
                </View>
                <View style={[styles.providerIcon, { backgroundColor: '#FEE500' }]}>
                  <MaterialCommunityIcons name="chat" size={20} color="#3C1E1E" />
                </View>
              </View>
            </View>
          </Dialog.Content>

          <Dialog.Actions style={styles.actions}>
            <Button
              onPress={onDismiss}
              textColor={theme.colors.onSurfaceVariant}
              style={styles.button}
            >
              나중에 하기
            </Button>
            <Button
              onPress={handleLogin}
              mode="contained"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              style={styles.button}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
            >
              로그인하기
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    paddingTop: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  providerContainer: {
    alignItems: 'center',
  },
  providerTitle: {
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
    marginBottom: spacing.sm,
  },
  providerIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
  loginButtonContent: {
    height: 44,
  },
  loginButtonLabel: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
  },
});
