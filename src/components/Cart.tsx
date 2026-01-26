import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment, Person } from './types';
import { useAppContext } from './AppContext';
import { removeAppointments, addAppointments, getUnpaidAppointments } from './consultationsServices';
import './Cart.css';
import Visit from './Visit';

const Cart = () => {
  const [unpaidList, setUnpaidList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { db, currentUserId } = useAppContext();

  useEffect(() => {
    const loadUnpaid = async () => {
      try {
        const data = await getUnpaidAppointments(db, currentUserId);
        setUnpaidList(data);
      } catch (error) {
        console.error("Błąd podczas ładowania:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnpaid();
  }, [db, currentUserId]);

  const pay = async () => {
    const paidList = unpaidList.map(app => ({ ...app, paid: true }));
    await removeAppointments(db, unpaidList);
    await addAppointments(db, paidList);
    setUnpaidList([]);
  };

  if (loading) return <div className="">Ładowanie...</div>;

  return (
    <div className="">
      <div className="gapRow10 center">
        <h2 className="">
          Nieopłacone Wizyty:
        </h2>
        <button className="submit-button" onClick={pay}>
          
          Opłać
        </button>
      </div>
      <div className="">
        {unpaidList.length === 0 ? (
          <p className="">Brak nieopłaconych wizyt.</p>
        ) : (
          <div className="visits">
            {unpaidList.map((app) => (
              <Visit key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;