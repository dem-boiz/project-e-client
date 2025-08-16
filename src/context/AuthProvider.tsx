import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './authContext';
import AuthManager from '../service/auth/TokenManager';
import { toast } from 'react-toastify';
import type { User } from '../types/network.types';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get cookie value with debugging
const getCookieValue = (name: string): string | undefined => {
  try {
    // Method 1: Using js-cookie
    const jsCookieValue = Cookies.get(name);
    console.log(`🍪 js-cookie result for ${name}:`, jsCookieValue);
    
    // Method 2: Manual parsing
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        console.log(`🍪 Manual parsing result for ${name}:`, cookieValue);
        return cookieValue;
      }
    }
    
    console.log(`🍪 Cookie ${name} not found`);
    return undefined;
  } catch (error) {
    console.error(`💥 Error reading cookie ${name}:`, error);
    return undefined;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Get token manager instance
  const authManager = AuthManager.getInstance();

  // Initialize auth state 
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a refresh token cookie (browser will send it automatically)
      try {
        console.log('🔄 Attempting initial token refresh...');

        // Debug cookie information
        console.log('🍪 All document.cookie:', document.cookie);
        console.log('🌐 Current location:', window.location.href);
        console.log('🌐 Current origin:', window.location.origin);
        console.log('🌐 Current pathname:', window.location.pathname);

        // Small delay to ensure cookies are fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🍪 After delay - All document.cookie:', document.cookie);

        // We check the cookie for initial csrf, if it doesnt exists, we'll have to log back in.
        // It should exists for as long as the refresh_token httpOnly cookie exists, if one does.
        const initialCsrf = getCookieValue('csrf_token');
        console.log('🔑 Final CSRF token result:', initialCsrf);
        authManager.setCsrf(initialCsrf || '');
        const refreshResult = await authManager.refreshAccessToken(true);
        if (refreshResult) {
          console.log('✅ Token refreshed successfully on app load');
          authManager.setCsrf(refreshResult.csrf_token || '');
          // Extract user data from the API
          const userData = await authManager.getUserFromToken();
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              token_type: 'Bearer',
              access_token: refreshResult.access_token,
              csrf_token: refreshResult.csrf_token || '', // Set CSRF token if available
            });
            console.log('👤 User data restored from API:', userData);
          } else {

            // TODO: Update to raise a fatal error.

            // Fallback if we can't fetch user data
            console.log('⚠️ Could not fetch user data, using fallback');
            setUser({
              id: 'temp-id',
              name: 'User',
              email: 'user@example.com',
              token_type: 'Bearer',
              access_token: refreshResult.access_token,
              csrf_token: refreshResult.csrf_token || ''
            });
          }
          
        } else {
          // No valid refresh token, user needs to sign in
          console.log('❌ No valid refresh token found');
        }
      } catch (error) {
        console.error('💥 Failed to refresh token on app load:', error);
        // Clear any stale data
        authManager.clearToken();
        setUser(null);
        // Show error message
        toast.error('An error occurred while refreshing the session token. Try signing back in.');
      }
    };

    initializeAuth();
  }, [authManager]);

  const login = (userData: User) => {
    setUser(userData);
    AuthManager.getInstance().setCsrf(userData.csrf_token || '');
    // Also set token in AuthManager with expiry
    try {
      const decodedToken = jwtDecode(userData.access_token) as { exp?: number };
      authManager.setToken(userData.access_token, decodedToken?.exp);
    } catch {
      authManager.setToken(userData.access_token);
    }
  };

  const logout = () => {
    console.log('Logging out user:', user?.name);
    AuthManager.getInstance().setCsrf('');
    setUser(null);
    authManager.clearToken();

    // Clear any localStorage remnants (from old implementation)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // TODO: HttpOnly cookies will be cleared by the backend when you call a logout endpoint
    // You might want to add a logout API call here to clear the refresh token cookie
    
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
