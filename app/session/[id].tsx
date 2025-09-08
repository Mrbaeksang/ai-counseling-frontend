import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">
        D Tt (Session ID: {id})
      </Text>
      <Text variant="bodyLarge" style={styles.placeholder}>
        D 0¥ l 
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    marginTop: 16,
    color: '#6B7280',
  },
});