import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { spacing } from '@/constants/theme';

export const SessionCardSkeleton = React.memo(() => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <SkeletonPlaceholder
          backgroundColor="#F3F4F6"
          highlightColor="#FFFFFF"
          speed={1200}
          borderRadius={8}
        >
          <View style={styles.header}>
            {/* Avatar */}
            <View style={styles.avatar} />

            <View style={styles.textContainer}>
              {/* Session Title */}
              <View style={styles.title} />
              {/* Last Message */}
              <View style={styles.subtitle} />
              {/* Time & Message Count */}
              <View style={styles.footer}>
                <View style={styles.time} />
                <View style={styles.count} />
              </View>
            </View>
          </View>
        </SkeletonPlaceholder>
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
