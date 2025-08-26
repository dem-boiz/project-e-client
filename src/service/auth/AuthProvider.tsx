import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '../../context/authContext';
import { createAuthService, type UserData, type AuthServiceCallbacks } from './index';
import { toast } from 'react-toastify';
import type { User } from '../../types/network.types';
import Cookies from 'js-cookie';

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
        setUser(prevUser => ({
          ...prevUser!,
          id: userData.id,
          name: userData.name,
          email: userData.email,
          isAuthenticated: true,
        }));
      },
      onLogin: (user: User) => {
        setUser(user);
      },
      onLogout: () => {
        setUser(null);
        console.log('User logged out via AuthService');
      },
      onAuthError: (error: string) => {
        console.error('AuthService error, setting user to null:', error);
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
        // TODO: Fix initial refresh request... This below is not
        // working as expected. ensure
        // .. Can we replace the below call with refreshToken call?
        // Or do we need a separate useEffect with an empty dependency array?
        const initialCsrf = Cookies.get('csrf_token');
        if (initialCsrf) authService.setCsrfToken(initialCsrf);
        const token = await authService.refreshAccessToken(true);

        if (token) {
          console.log('✅ Authentication restored successfully');
          // Get user data from the API
          const userData = await authService.getUserFromToken();
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              isAuthenticated: true
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




  const isAuthenticated = (): boolean => {
    return !!(
      user?.isAuthenticated
      && user?.id
      && user?.email
      && user?.name
    );
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
