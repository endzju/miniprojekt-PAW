import { useEffect, useState } from 'react';
import type { Appointment } from './types';
import { useAppContext } from './AppContext';
import { getPaidAppointments, fetchAppointments } from './consultationsServices';
import './Cart.css';
import Visit from './Visit';

const Appointments = () => {
  const [PaidList, setPaidList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { db, currentUser } = useAppContext();

  useEffect(() => {
    const loadUnpaid = async () => {
      try {
        const data = await getPaidAppointments(db, currentUser?.id || '');
        setPaidList(data);
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      } finally {
        setLoading(false);
      }
    };
    const loadDoctorAppointments = async () => {
      try {
        const data = await fetchAppointments(db);
        const filteredData = data.filter(app => app.doctorId === currentUser?.id);
        setPaidList(filteredData);
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser?.role === 'doctor') loadDoctorAppointments(); else loadUnpaid();
  }, [db, currentUser]);

  if (loading) return <div className="">Ładowanie...</div>;

  return (
    <div className="">
      <div className="gapRow10 center">
        <h2 className="">
          Wizyty:
        </h2>
      </div>
      <div className="">
        {PaidList.length === 0 ? (
          <p className="">Brak wizyt.</p>
        ) : (
          <div className="visits">
            {PaidList.map((app) => (
              <Visit key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;