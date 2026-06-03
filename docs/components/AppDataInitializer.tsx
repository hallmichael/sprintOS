import React, { useEffect } from 'react';
import { useInitializeAppData } from '@/hooks/useInitializeAppData';

interface AppDataInitializerProps {
  children: React.ReactNode;
}

export const AppDataInitializer: React.FC<AppDataInitializerProps> = ({ children }) => {
  // Initialize all app data that should be persisted in Redux
  useInitializeAppData();
  
  return <>{children}</>;
}; 