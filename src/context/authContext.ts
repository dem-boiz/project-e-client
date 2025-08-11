import { createContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token_type: string;
  access_token: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (userData: User, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
