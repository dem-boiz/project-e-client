import { createContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
