import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { spacing } from '@/constants/theme';

export const CharacterCardSkeleton = React.memo(() => {
  return (
    <View style={styles.cardWrapper}>
      <Surface style={styles.card}>
        <View style={styles.content}>
          <View style={styles.imageSkeleton} />
          <View style={styles.infoSection}>
            <View style={styles.nameSkeleton} />
            <View style={styles.descriptionSkeleton} />
          </View>
        </View>
      </Surface>
    </View>
  );
});

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    margin: spacing.sm,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  content: {
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: '#FAFBFF',
  },
  imageSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    marginBottom: spacing.sm,
  },
  infoSection: {
    alignItems: 'center',
    width: '100%',
  },
  nameSkeleton: {
    width: '60%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  descriptionSkeleton: {
    width: '90%',
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});
