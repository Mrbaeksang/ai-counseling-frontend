import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, useTheme } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export const SessionCardSkeleton = React.memo(() => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant }]}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>

          <View style={styles.textContainer}>
            <View style={[styles.title, { backgroundColor: theme.colors.surfaceVariant }]} />
            <View style={[styles.subtitle, { backgroundColor: theme.colors.surfaceVariant }]} />
            <View style={styles.footer}>
              <View style={[styles.time, { backgroundColor: theme.colors.surfaceVariant }]} />
              <View style={[styles.count, { backgroundColor: theme.colors.surfaceVariant }]} />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
});

SessionCardSkeleton.displayName = 'SessionCardSkeleton';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    elevation: 2,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  title: {
    height: 18,
    width: '60%',
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  subtitle: {
    height: 14,
    width: '85%',
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  time: {
    height: 12,
    width: 60,
    borderRadius: 4,
  },
  count: {
    height: 12,
    width: 40,
    borderRadius: 4,
  },
});

export default SessionCardSkeleton;
