import { createContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token_type: string;
  access_token: string;
  csrf_token: string; // CSRF token for security
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
