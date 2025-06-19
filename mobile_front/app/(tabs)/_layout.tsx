import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import HomeScreen from '../(tabs)/index';
import Chatrooms from '../(tabs)/chatrooms';
import TrackingTab from '../tracking/tracking';

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
