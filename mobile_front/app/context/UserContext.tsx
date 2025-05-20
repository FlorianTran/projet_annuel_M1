import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/lib/models/user';

interface UserContextProps {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, _setUser] = useState<User | null>(null);

  const setUser = (user: User) => _setUser(user);
  const clearUser = () => _setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
