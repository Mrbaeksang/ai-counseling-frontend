import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">채팅 화면 (Session ID: {id})</Text>
      <Text variant="bodyLarge" style={styles.placeholder}>
        채팅 기능 구현 예정
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
