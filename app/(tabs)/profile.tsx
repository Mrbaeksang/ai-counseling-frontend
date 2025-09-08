import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';
import useAuthStore from '@/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" />
        <Text variant="headlineMedium" style={styles.name}>
          {user?.nickname || '사용자'}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email || ''}
        </Text>
      </View>

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
        로그아웃
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 8,
    color: '#6B7280',
  },
  logoutButton: {
    marginTop: 32,
  },
});
