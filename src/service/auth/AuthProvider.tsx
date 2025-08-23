import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '../../context/authContext';
import { createAuthService, type UserData, type AuthServiceCallbacks } from './index';
import { toast } from 'react-toastify';
import type { User } from '../../types/network.types';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Create shared AuthService instance with callbacks for React integration
  const [authService] = useState(() => {
    const callbacks: AuthServiceCallbacks = {
      onTokenRefreshed: (userData: UserData) => {
        console.log('🔄 Token refreshed, updating user data:', userData);
        // Update user state when token is refreshed
        const headers = authService.getAuthHeaders();
        setUser(prevUser => ({
          ...prevUser!,
          id: userData.id,
          name: userData.name,
          email: userData.email,
          csrf_token: headers['X-CSRF-Token'] || prevUser?.csrf_token || ''
        }));
      },
      onLogout: () => {
        setUser(null);
        console.log('User logged out via AuthService');
      },
      onAuthError: (error: string) => {
        console.error('AuthService error:', error);
        toast.error(error);
        setUser(null);
      }
    };

    return createAuthService(callbacks);
  });

  // Initialize auth state 
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Attempting initial authentication check...');
        
        // Try to get a valid token (will handle refresh automatically)
        const tokenIsValid = await authService.ensureValidToken();
        
        if (tokenIsValid) {
          console.log('✅ Authentication restored successfully');
          // Get user data from the API
          const userData = await authService.getUserFromToken();
          if (userData) {
            // Update user state with current token and headers
            const headers = authService.getAuthHeaders();
            const currentToken = authService.getAccessToken();
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              token_type: 'Bearer',
              access_token: currentToken || '',
              csrf_token: headers['X-CSRF-Token'] || ''
            });
            console.log('👤 User data restored:', userData);
          }
        } else {
          console.log('❌ No valid authentication found');
        }
      } catch (error) {
        console.error('💥 Failed to initialize authentication:', error);
        toast.error('An error occurred while restoring your session. Please sign in again.');
      }
    };

    initializeAuth();
  }, [authService]);

  const login = (userData: User) => {
    setUser(userData);
    console.log('Logging in user via AuthProvider:', userData);
    
    // Set the token and CSRF in AuthService
    try {
      const decodedToken = jwtDecode(userData.access_token) as { exp?: number };
      authService.setToken(userData.access_token, decodedToken?.exp);
    } catch (error) {
      console.warn('Could not decode token for expiry:', error);
      authService.setToken(userData.access_token);
    }
    
    if (userData.csrf_token) {
      authService.setCsrfToken(userData.csrf_token);
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.name);
    
    // Use AuthService logout which will trigger the callback
    authService.logout();
    
    // Clear any localStorage remnants (from old implementation)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    console.log('User logged out successfully');
  };



  const isAuthenticated = (): boolean => {
    return !!(
      user?.access_token
      && user?.id
      && user?.email
      && user?.name
    );
  };

  const value: AuthContextType = {
    user,
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
