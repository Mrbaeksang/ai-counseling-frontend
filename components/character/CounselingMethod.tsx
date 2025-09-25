import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { COUNSELING_METHODS } from '@/constants/counselingMethods';
import { spacing } from '@/constants/theme';

export const CounselingMethod = React.memo(() => {
  return (
    <Surface style={styles.section}>
      <Text style={styles.sectionTitle}>마인드톡 즐기는 방법</Text>

      {COUNSELING_METHODS.map((method) => (
        <View key={method.number} style={styles.methodItem}>
          <MaterialCommunityIcons
            name={
              `numeric-${method.number}-circle` as
                | 'numeric-1-circle'
                | 'numeric-2-circle'
                | 'numeric-3-circle'
                | 'numeric-4-circle'
                | 'numeric-5-circle'
            }
            size={20}
            color="#6B46C1"
          />
          <View style={styles.methodTextContainer}>
            <Text style={styles.methodText}>{method.title}</Text>
            <Text style={styles.methodSubtext}>{method.description}</Text>
          </View>
        </View>
      ))}
    </Surface>
  );
});

CounselingMethod.displayName = 'CounselingMethod';

const styles = StyleSheet.create({
  section: {
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: spacing.md,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard-Bold',
    color: '#111827',
    marginBottom: spacing.sm,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
});
