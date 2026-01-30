import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import type { Person } from './types';
import { getDoctors } from './consultationsServices';

const DoctorsList: React.FC = () => {
  const { doctorsMap, setDoctorsMap, db, refresh } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const doctorsData = await getDoctors(db) as Person[];
      const dMap = new Map(doctorsData.map(d => [d.id, d]));
      setDoctorsMap(dMap);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Wystąpił błąd podczas pobierania lekarzy");
      }
    } finally {
      setIsLoading(false);
    }
  };

  loadDoctors();
}, [db, refresh]);

  if (isLoading) return <div>Ładowanie danych z bazy {db}...</div>;
  if (error) return <div>Błąd: {error}</div>;
  return (
    <>
    <h2 className="">Lista Lekarzy:</h2>
    
    <div className="">
      {Array.from(doctorsMap.values()).map((doctor) => (
        <p className="">{doctor.firstName} {doctor.lastName}</p>
      ))}
    </div>

    </>
  );
};

export default DoctorsList;