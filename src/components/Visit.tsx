import React from 'react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment } from './types';
import './Visit.css';
import { removeAppointments, addDoctorAvailability } from './consultationsServices';
import { useAppContext } from './AppContext';
import { useState } from 'react';

interface VisitProps {
  app: Appointment;
  canCancelVisit?: boolean;
  info?: boolean;
}

const Visit: React.FC<VisitProps> = ({ app, canCancelVisit = true, info = false }) => {
  const dateObj = typeof app.startTime === 'string' 
    ? parseISO(app.startTime) 
    : app.startTime; 
  const { db, doctorsMap } = useAppContext();
  const [isCancelled, setIsCancelled] = useState(false);

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
          Wiek/Płeć: {app.age}/{app.gender}
        </p>
        <p className="">
          Telefon: {app.phoneNumber}
        </p>
        <p className="">
          Lekarz: {doctorsMap.get(app.doctorId)?.firstName} {doctorsMap.get(app.doctorId)?.lastName}
        </p>
        <p className="appointment-type">
          {app.appointmentType}
        </p>
        {canCancelVisit && (
          <button 
            className="cancel-button" 
            onClick={() => cancelAppointment()}
            disabled={isCancelled}
          >
            {isCancelled ? 'Anulowano' : 'Anuluj wizytę'}
          </button>
        )}
      </div>
      {info && (
        <div className="visit-info">
          <p className="visit-info-title">Informacje:</p>
          <p className="visit-info-text">{app.info}</p>
        </div>
      )}
    </div>
  );
};

export default Visit;