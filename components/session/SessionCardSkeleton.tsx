import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

export const SessionCardSkeleton = React.memo(() => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View style={styles.textContainer}>
            <View style={styles.title} />
            <View style={styles.subtitle} />
            <View style={styles.time} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    height: 20,
    width: '70%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    height: 16,
    width: '50%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
  },
  time: {
    height: 14,
    width: '40%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});

export default SessionCardSkeleton;
