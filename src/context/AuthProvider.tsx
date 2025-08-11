import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './authContext';
import { TokenManager } from '../service/auth/TokenManager';
import { toast } from 'react-toastify';
import type { User } from '../types/network.types';
import { useNavigate } from 'react-router';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const navigate = useNavigate();

  // Get token manager instance
  const tokenManager = TokenManager.getInstance();

  // Initialize auth state 
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a refresh token cookie (browser will send it automatically)
      try {
        const refreshResult = await tokenManager.refreshAccessToken();
        if (refreshResult) {
          // Successfully refreshed, set tokens in memory
          setAccessToken(refreshResult.access_token);
          
          // You might want to also set user data here if your backend provides it
          // For now, we'll assume the user data needs to be fetched separately
          console.log('Token refreshed successfully on app load');
        } else {
          // No valid refresh token, user needs to sign in
          console.log('No valid refresh token found');
        }
      } catch (error) {
        console.error('Failed to refresh token on app load:', error);
        // Clear any stale data
        tokenManager.clearToken();
        setAccessToken(null);
        setUser(null);
        // Show error message
        toast.error('An error occurred while refreshing the session token. Try signing back in.');
        //navigate('/sign-in'); // Redirect to sign-in page
      }
    };

    initializeAuth();
  }, [navigate, tokenManager]);

  const login = (userData: User) => {
    setUser(userData);
    setAccessToken(userData.access_token);
  };

  const logout = () => {
    console.log('Logging out user:', user?.name);
    setUser(null);
    setAccessToken(null);
    tokenManager.clearToken();

    // Clear any localStorage remnants (from old implementation)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // TODO: HttpOnly cookies will be cleared by the backend when you call a logout endpoint
    // You might want to add a logout API call here to clear the refresh token cookie
    
    console.log('User logged out successfully');
  };

  const isAuthenticated = (): boolean => {
    return !!(user && accessToken);
  };

  const value: AuthContextType = {
    user,
    accessToken,
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
