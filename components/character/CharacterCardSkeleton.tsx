import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Surface, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export function CharacterCardSkeleton() {
  const theme = useTheme();

  return (
    <Surface style={styles.card}>
      <View style={styles.container}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>

        <View style={styles.content}>
          <View style={[styles.titleBar, { backgroundColor: theme.colors.surfaceVariant }]} />
          <View style={[styles.subtitleBar, { backgroundColor: theme.colors.surfaceVariant }]} />
          <View style={[styles.descriptionBar, { backgroundColor: theme.colors.surfaceVariant }]} />

          <View style={styles.footer}>
            <View style={styles.stats}>
              <View
                style={[styles.chipSkeleton, { backgroundColor: theme.colors.surfaceVariant }]}
              />
              <View
                style={[styles.chipSkeleton, { backgroundColor: theme.colors.surfaceVariant }]}
              />
            </View>
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleBar: {
    width: '40%',
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitleBar: {
    width: '60%',
    height: 12,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  descriptionBar: {
    width: '90%',
    height: 14,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chipSkeleton: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
});
