import { useEffect, useState } from 'react';
import type { Appointment } from './types';
import { useAppContext } from './AppContext';
import { fetchCanceledAppointmentsByUser } from './consultationsServices';
import './CanceledAppointments.css';
import Visit from './Visit';

const CanceledAppointments = () => {
  const [canceledList, setCanceledList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { db, currentUser } = useAppContext();

  useEffect(() => {
    const loadCanceled = async () => {
      try {
        const data = await fetchCanceledAppointmentsByUser(db, currentUser?.id || '');
        setCanceledList(data);
        
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCanceled();
  }, [db, currentUser]);

  if (loading) return <div className="">Ładowanie...</div>;

  return (
    <div className="">
      <h2 className="">
        Wizyty odwołane przez lekarza:
      </h2>
      <div className="">
        {canceledList.length === 0 ? (
          <p className="">Brak odwołanych wizyt w historii.</p>
        ) : (
          <div className="visits">
            {canceledList.map((app) => (
              <Visit key={app.id} app={app} canCancelVisit={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanceledAppointments;