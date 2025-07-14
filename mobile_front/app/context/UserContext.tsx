import { User } from '@/lib/models/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserContextProps {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => { },
  clearUser: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, _setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('UserContext: Loading stored user');
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          console.log('UserContext: Found stored user');
          _setUser(JSON.parse(stored));
        } else {
          console.log('UserContext: No stored user found');
        }
      } catch (error) {
        console.error('UserContext: Error loading stored user:', error);
      }
    };
    loadStoredUser();
  }, []);

  const setUser = async (user: User) => {
    console.log('UserContext: Setting user', user.id);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      _setUser(user);
    } catch (error) {
      console.error('UserContext: Error setting user:', error);
    }
  };

  const clearUser = async () => {
    console.log('UserContext: Clearing user');
    try {
      await AsyncStorage.removeItem('user');
      _setUser(null);
    } catch (error) {
      console.error('UserContext: Error clearing user:', error);
    }
  };

  console.log('UserContext: Rendering with user:', !!user);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
