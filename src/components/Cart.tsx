import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment, Person } from './types';
import { useAppContext } from './AppContext';
import { getUnpaindAppointments, getDoctors } from './consultationsServices';
import './Cart.css';

const Cart = () => {
  const [unpaidList, setUnpaidList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsMap, setDoctorsMap] = useState<Map<string, string>>(new Map());
  const { db, currentUserId } = useAppContext();

  useEffect(() => {
    const loadUnpaid = async () => {
      try {
        const data = await getUnpaindAppointments(db, currentUserId);
        setUnpaidList(data);
        const doctorsArray: Person[] = await getDoctors(db);
        const dMap = new Map<string, string>();
        doctorsArray.forEach(doctor => {
            const fullName = `${doctor.firstName} ${doctor.lastName}`;
            dMap.set(doctor.id || '', fullName);
        });
        setDoctorsMap(dMap);
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnpaid();
  }, [db, currentUserId]);

  if (loading) return <div className="">Ładowanie...</div>;

  return (
    <div className="">
      <div className="gapRow10 center">
        <h2 className="">
          Nieopłacone Wizyty:
        </h2>
        <button className="submit-button">
          Opłać
        </button>
      </div>
      <div className="">
        {unpaidList.length === 0 ? (
          <p className="">Brak nieopłaconych wizyt.</p>
        ) : (
          <div className="visits">
            {unpaidList.map((app) => (
              <div 
                key={app.id} 
                className="visit"
              >
                <div className="">
                  <p className="">
                    {format(parseISO(app.startTime), "d MMMM yyyy", { locale: pl })}
                  </p>
                  <p className="">
                    Godzina: <span className="">{format(parseISO(app.startTime), "HH:mm")}</span>
                  </p>
                  <p className="">
                    Pacjent: {app.firstName} {app.lastName}
                  </p>
                  <p className="">
                    Lekarz: {doctorsMap.get(app.doctorId)}
                  </p>
                  <p className="">
                    {app.appointmentType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;