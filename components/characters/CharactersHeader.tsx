import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

interface CharactersHeaderProps {
  title: string;
  subtitle: string;
}

export const CharactersHeader = React.memo(({ title, subtitle }: CharactersHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.titleSection}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="robot-happy" size={20} color={theme.colors.primary} />
        </View>
        <View>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    marginTop: 2,
  },
});
