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
    const storedUser = localStorage.getItem('tripwise_user');
    const storedName = localStorage.getItem('tripwise_name');
    
    if (storedUser && storedName) {
      return {
        identifier: storedUser,
        name: storedName,
        isAuthenticated: true,
      };
    }
    return null;
  });

  const login = (identifier, name) => {
    const userData = {
      identifier,
      name,
      isAuthenticated: true,
    };
    setUser(userData);
    localStorage.setItem('tripwise_user', identifier);
    localStorage.setItem('tripwise_name', name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tripwise_user');
    localStorage.removeItem('tripwise_name');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
