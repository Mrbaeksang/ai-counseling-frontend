import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, List, type MD3Theme, RadioButton, Text, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';
import useThemeStore, { type ThemeMode } from '@/store/themeStore';

const themeOptions = [
  {
    value: 'light' as ThemeMode,
    label: '라이트 모드',
    description: '밝은 테마를 사용해요',
    icon: 'white-balance-sunny',
  },
  {
    value: 'dark' as ThemeMode,
    label: '다크 모드',
    description: '어두운 테마로 눈의 피로를 줄여요',
    icon: 'moon-waning-crescent',
  },
  {
    value: 'system' as ThemeMode,
    label: '시스템 설정 따르기',
    description: '기기 설정에 맞춰 자동으로 전환돼요',
    icon: 'cellphone',
  },
] as const;

interface ThemeSelectorProps {
  visible: boolean;
  onDismiss: () => void;
}

export const ThemeSelector = React.memo(({ visible, onDismiss }: ThemeSelectorProps) => {
  const theme = useTheme();
  const { mode, setTheme } = useThemeStore();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleThemeChange = useCallback(
    async (selectedMode: ThemeMode) => {
      await setTheme(selectedMode);
      onDismiss();
    },
    [setTheme, onDismiss],
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="palette" size={24} color={theme.colors.primary} />
            <View style={styles.headerText}>
              <Text style={styles.title}>테마 선택</Text>
              <Text style={styles.subtitle}>원하는 화면 분위기를 골라보세요</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {themeOptions.map((option) => (
              <List.Item
                key={option.value}
                title={option.label}
                description={option.description}
                left={() => (
                  <View style={styles.leftContainer}>
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={24}
                      color={
                        mode === option.value ? theme.colors.primary : theme.colors.onSurfaceVariant
                      }
                    />
                  </View>
                )}
                right={() => (
                  <RadioButton
                    value={option.value}
                    status={mode === option.value ? 'checked' : 'unchecked'}
                    onPress={() => handleThemeChange(option.value)}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => handleThemeChange(option.value)}
                style={[styles.option, mode === option.value && styles.selectedOption]}
                titleStyle={[styles.optionTitle, mode === option.value && styles.selectedTitle]}
                descriptionStyle={[
                  styles.optionDescription,
                  mode === option.value && styles.selectedDescription,
                ]}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              현재 테마: {themeOptions.find((opt) => opt.value === mode)?.label}
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
});

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    container: {
      width: '90%',
      maxWidth: 400,
    },
    card: {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      elevation: 8,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Pretendard-Bold',
      color: theme.colors.onSurface,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Pretendard-Regular',
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    optionsContainer: {
      paddingHorizontal: spacing.sm,
    },
    leftContainer: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    option: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.sm,
      borderRadius: 12,
      marginBottom: spacing.xs,
    },
    selectedOption: {
      backgroundColor: theme.colors.primaryContainer,
    },
    optionTitle: {
      fontSize: 16,
      fontFamily: 'Pretendard-Medium',
      color: theme.colors.onSurface,
    },
    selectedTitle: {
      color: theme.colors.primary,
      fontFamily: 'Pretendard-SemiBold',
    },
    optionDescription: {
      fontSize: 13,
      fontFamily: 'Pretendard-Regular',
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    selectedDescription: {
      color: theme.colors.primary,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
      marginTop: spacing.sm,
    },
    footerText: {
      fontSize: 12,
      fontFamily: 'Pretendard-Regular',
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
    },
  });
