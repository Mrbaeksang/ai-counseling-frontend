import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface EmptySessionStateProps {
  icon: 'chat-processing' | 'check-circle' | 'star';
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onPress: () => void;
  };
}

export const EmptySessionState = React.memo(
  ({ icon, title, subtitle, actionButton }: EmptySessionStateProps) => {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name={icon} size={64} color="#BDBDBD" style={styles.icon} />
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
        {actionButton && (
          <Button mode="contained" style={styles.button} onPress={actionButton.onPress}>
            {actionButton.label}
          </Button>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    color: '#424242',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});

export default EmptySessionState;
