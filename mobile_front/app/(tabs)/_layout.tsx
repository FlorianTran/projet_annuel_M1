import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import HomeScreen from '../(tabs)/index';
import Chatrooms from '../(tabs)/chatrooms';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace('/select-user');
    }
  }, [user, isLoading]);

  if (!user) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'index' ? 'home' : 'chatbubbles';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="index" options={{ title: 'Accueil' }} component={HomeScreen} />
      <Tab.Screen name="chatrooms" options={{ title: 'Salons' }} component={Chatrooms} />
    </Tab.Navigator>
  );
}
