import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/lib/models/user';

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
    const loadStoredUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        _setUser(JSON.parse(stored));
      }
    };
    loadStoredUser();
  }, []);

  const setUser = async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    _setUser(user);
  };

  const clearUser = async () => {
    await AsyncStorage.removeItem('user');
    _setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
