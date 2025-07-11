import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Chatrooms from '../(tabs)/chatrooms';
import HomeScreen from '../(tabs)/index';
import { useUser } from '../context/UserContext';
import TrackingTab from '../tracking/tracking';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const readyTimeout = setTimeout(() => setIsReady(true), 200);
      return () => clearTimeout(readyTimeout);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!user && !isLoading && isReady) {
      console.log('No user found in tabs, redirecting to login');
      router.replace('/login');
    }
  }, [user, isLoading, isReady, router]);

  // Show loading screen while checking authentication
  if (isLoading || !isReady) {
    return null;
  }

  // Don't render tabs if no user
  if (!user) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'Suivis':
              iconName = 'bar-chart';
              break;
            case 'chatrooms':
              iconName = 'chatbubbles';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="index" options={{ title: 'Accueil' }} component={HomeScreen} />
      <Tab.Screen name="Suivis" options={{ title: 'Suivi' }} component={TrackingTab} />
      <Tab.Screen name="chatrooms" options={{ title: 'Messages' }} component={Chatrooms} />
    </Tab.Navigator>
  );
}
