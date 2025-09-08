import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Text, useTheme } from 'react-native-paper';

interface Counselor {
  id: number;
  name: string;
  desc: string;
}

export default function CounselorsScreen() {
  const _theme = useTheme();

  const counselors: Counselor[] = [
    { id: 1, name: '소크라테스', desc: '너 자신을 알라' },
    { id: 2, name: '공자', desc: '인의예지' },
    { id: 3, name: '부처님', desc: '고통에서의 해탈' },
  ];

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        철학자 상담사
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
