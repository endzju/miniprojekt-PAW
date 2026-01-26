import React, { useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment, Person } from './types';
import './Visit.css';
import { getDoctors, removeAppointments, addDoctorAvailability } from './consultationsServices';
import { useAppContext } from './AppContext';
import { useState } from 'react';

interface VisitProps {
  app: Appointment;
  canCancelVisit?: boolean;
}

const Visit: React.FC<VisitProps> = ({ app, canCancelVisit = false }) => {
  const dateObj = typeof app.startTime === 'string' 
    ? parseISO(app.startTime) 
    : app.startTime; 
  const { db } = useAppContext();
  const [doctorsMap, setDoctorsMap] = useState<Map<string, string>>(new Map());
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
    const doctorsArray: Person[] = await getDoctors(db);
    const dMap = new Map<string, string>();
    doctorsArray.forEach(doctor => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`;
        dMap.set(doctor.id || '', fullName);
    });
    setDoctorsMap(dMap);
    };
    loadDoctors();
  }, [app]);

  const cancelAppointment = () => {
    removeAppointments(db, [app]);
    addDoctorAvailability(db, [app]);
    setIsCancelled(true);
  };

  return (
    <div className="visit">
      <div className="">
        <p className="visit-date">
          {format(dateObj, "d MMMM yyyy", { locale: pl })}
        </p>
        <p className="">
          Godzina: <span className="bold">{format(dateObj, "HH:mm")}</span>
        </p>
        <p className="">
          Pacjent: {app.firstName} {app.lastName}
        </p>
        <p className="">
          Lekarz: {doctorsMap.get(app.doctorId)}
        </p>
        <p className="appointment-type">
          {app.appointmentType}
        </p>
        <button className="cancel-button" onClick={() => cancelAppointment()}>{isCancelled ? 'Wizyta anulowana' : 'Anuluj wizyte'}</button>
      </div>
    </div>
  );
};

export default Visit;