import { StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { spacing } from '@/constants/theme';

export function CounselorCardSkeleton() {
  return (
    <Surface style={styles.card}>
      <SkeletonPlaceholder
        backgroundColor="#F3F4F6"
        highlightColor="#FFFFFF"
        speed={1200}
        borderRadius={8}
      >
        <View style={styles.container}>
          {/* Avatar */}
          <View style={styles.avatar} />

          <View style={styles.content}>
            {/* Name */}
            <View style={styles.titleBar} />
            {/* Philosophy */}
            <View style={styles.subtitleBar} />
            {/* Description */}
            <View style={styles.descriptionBar} />

            {/* Stats */}
            <View style={styles.footer}>
              <View style={styles.stats}>
                <View style={styles.chipSkeleton} />
                <View style={styles.chipSkeleton} />
              </View>
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
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
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  titleBar: {
    width: '40%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitleBar: {
    width: '60%',
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  descriptionBar: {
    width: '90%',
    height: 14,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});
