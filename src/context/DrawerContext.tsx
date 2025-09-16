import { createContext } from 'react';

interface DrawerContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const DrawerContext = createContext<DrawerContextType | undefined>(undefined);