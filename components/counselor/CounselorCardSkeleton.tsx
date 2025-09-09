import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export function CounselorCardSkeleton() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Surface style={styles.card}>
      <View style={styles.container}>
        <Animated.View style={[styles.avatar, { opacity }]}>
          <LinearGradient
            colors={['#E5E7EB', '#F3F4F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          />
        </Animated.View>

        <View style={styles.content}>
          <Animated.View style={[styles.titleBar, { opacity }]} />
          <Animated.View style={[styles.subtitleBar, { opacity }]} />
          <Animated.View style={[styles.descriptionBar, { opacity }]} />

          <View style={styles.footer}>
            <View style={styles.stats}>
              <Animated.View style={[styles.chipSkeleton, { opacity }]} />
              <Animated.View style={[styles.chipSkeleton, { opacity }]} />
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
