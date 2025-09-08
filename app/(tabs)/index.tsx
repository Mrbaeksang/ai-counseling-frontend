import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar, useTheme } from 'react-native-paper';

export default function CounselorsScreen() {
  const theme = useTheme();

  const counselors = [
    { id: 1, name: 'ål|L§', desc: ' ê‡D L|' },
    { id: 2, name: 'ıê', desc: 'xX¿' },
    { id: 3, name: 'Äòÿ', desc: '‡µ–X t»' },
  ];

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        †Yê ¡Ù¨
      </Text>
      <ScrollView>
        {counselors.map((counselor) => (
          <Card key={counselor.id} style={styles.card}>
            <Card.Title
              title={counselor.name}
              subtitle={counselor.desc}
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
  },
});