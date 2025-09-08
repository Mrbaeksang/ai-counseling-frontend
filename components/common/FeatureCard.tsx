import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';

interface FeatureCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
}

export const FeatureCard = ({ icon, text }: FeatureCardProps) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={24} color="#FFFFFF" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  text: {
    ...typography.labelMedium,
    color: colors.neutral[0],
    marginTop: spacing.xs,
  },
});
