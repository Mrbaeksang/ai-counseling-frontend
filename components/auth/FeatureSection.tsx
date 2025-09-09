import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, spacing } from '@/constants/theme';

export const FeatureSection = React.memo(() => {
  return (
    <View style={styles.featuresSection}>
      <View style={styles.featureItem}>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color="#374151" />
        <Text style={styles.featureText}>안전한 공간</Text>
      </View>
      <View style={styles.featureDivider} />
      <View style={styles.featureItem}>
        <MaterialCommunityIcons name="heart-outline" size={20} color="#374151" />
        <Text style={styles.featureText}>깊은 공감</Text>
      </View>
      <View style={styles.featureDivider} />
      <View style={styles.featureItem}>
        <MaterialCommunityIcons name="brain" size={20} color="#374151" />
        <Text style={styles.featureText}>전문적 통찰</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl * 1.5,
    borderRadius: borderRadius.xl,
    marginHorizontal: -spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xs,
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.md,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
});
