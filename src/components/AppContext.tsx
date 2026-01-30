import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Person } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import { getUser } from './consultationsServices';


interface AppContextType {
  db: string;
  setDb: (value: string) => void;
  currentUser?: Person | null;
  setCurrentUser: (value: Person | null) => void;
  doctorsMap: Map<string, Person>;
  setDoctorsMap: (value: Map<string, Person>) => void;
  refresh: number;
  setRefresh: (value: number) => void;
  handleDbChange: (newDb: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<string>('firebase');
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [doctorsMap, setDoctorsMap] = useState<Map<string, Person>>(new Map());
  const [refresh, setRefresh] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);


  const handleDbChange = (newDb: string) => {
    setDb(newDb);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const fullUserData = await getUser(db, firebaseUser.uid);
        setCurrentUser(fullUserData);
      } catch (err) {
        console.error("Błąd pobierania danych użytkownika:", err);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [db]);

  
  return (
    <AppContext.Provider value={{ db, setDb, currentUser, setCurrentUser,
          doctorsMap, setDoctorsMap, refresh, setRefresh, handleDbChange}}>
      {loading ? <div style={{marginTop: "10px", fontSize: "25px"}}>Ładowanie...</div> : children}
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