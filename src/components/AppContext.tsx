import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';


interface AppContextType {
  db: string;
  setDb: (value: string) => void;
  currentUserId: string;
  setCurrentUserId: (value: string) => void;
  currentDoctorId: string;
  setCurrentDoctorId: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<string>('local');
  const [currentUserId, setCurrentUserId] = useState<string>('2222');
  const [currentDoctorId, setCurrentDoctorId] = useState<string>('1111');
  

  return (
    <AppContext.Provider value={{ db, setDb, currentUserId, setCurrentUserId, currentDoctorId, setCurrentDoctorId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};