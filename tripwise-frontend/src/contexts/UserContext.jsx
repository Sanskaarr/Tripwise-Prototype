import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedIdentifier = localStorage.getItem('tripwise_user');
    const storedName = localStorage.getItem('tripwise_name');
    const storedUserId = localStorage.getItem('tripwise_userId');
    const storedPhone = localStorage.getItem('tripwise_phone');

    if (storedIdentifier || storedUserId) {
      return {
        identifier: storedIdentifier || storedPhone,
        name: storedName || '',
        userId: storedUserId || null,
        phoneNumber: storedPhone || storedIdentifier || null,
        isAuthenticated: true,
      };
    }
    return null;
  });

  const login = (payload, fallbackName) => {
    const identifier = typeof payload === 'object' ? payload.identifier : payload;
    const name = typeof payload === 'object' ? payload.name : fallbackName;
    const userId = typeof payload === 'object' ? payload.userId : null;
    const phoneNumber = typeof payload === 'object' ? payload.phoneNumber : payload;

    const userData = {
      identifier,
      name: name || '',
      userId: userId || null,
      phoneNumber: phoneNumber || null,
      isAuthenticated: true,
    };

    setUser(userData);
    if (identifier) localStorage.setItem('tripwise_user', identifier);
    if (name) localStorage.setItem('tripwise_name', name);
    if (userId) localStorage.setItem('tripwise_userId', userId);
    if (phoneNumber) localStorage.setItem('tripwise_phone', phoneNumber);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripwise_user');
    localStorage.removeItem('tripwise_name');
    localStorage.removeItem('tripwise_userId');
    localStorage.removeItem('tripwise_phone');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

