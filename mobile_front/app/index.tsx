import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useUser } from './context/UserContext';

export default function Index() {
  const { user } = useUser();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('Index: Component mounted');
    // Add a delay to ensure the navigation is ready
    const timer = setTimeout(() => {
      console.log('Index: Setting ready state');
      setIsReady(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Index: Navigation effect triggered', { user: !!user, isReady });
    if (!isReady) return;

    if (user) {
      console.log('Index: User found, redirecting to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('Index: No user found, redirecting to login');
      router.replace('/login');
    }
  }, [user, router, isReady]);

  console.log('Index: Rendering', { user: !!user, isReady });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 16 }}>Chargement...</Text>
    </View>
  );
} 