import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './authContext';

interface User {
  id: string;
  name: string;
  email: string;
  token_type: string;
  access_token: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {

    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setToken(userData.access_token);

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', userData.access_token);
  };

  const logout = () => {
    console.log('Logging out user:', user?.name);
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    console.log('User logged out successfully');
    console.log('localStorage after logout: user:', localStorage.getItem('user'));
    console.log('localStorage after logout: authToken:', localStorage.getItem('authToken'));
  };

  const isAuthenticated = (): boolean => {
    return !!(user && token);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
