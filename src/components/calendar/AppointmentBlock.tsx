import React, { useState } from 'react';
import type { Appointment } from '../types';
import './AppointmentBlock.css';
import { AppointmentModal } from '../AppointmentModal';
import { useAppContext } from '../AppContext';

interface Props {
  appointments: Appointment[]; // Tablica z grupy o tej samej godzinie
  slotHeight: number;
  startHour: number; // Musisz to przekazać, żeby dobrze policzyć 'top'
}

export const AppointmentBlock: React.FC<Props> = ({ appointments, slotHeight, startHour }) => {
  const firstApp = appointments[0];
  const startTime = new Date(firstApp.startTime);
  const isPast = startTime < new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAppContext();
  
  const startMinutes = (startTime.getHours() - startHour) * 60 + startTime.getMinutes();
  const top = (startMinutes / 30) * slotHeight;
  
  const isFull = appointments.every(app => app.userId !== "");


  return (
    <>
      <div 
        className={`appointment-block ${isFull ? 'full' : 'free'} ${isPast ? 'past' : ''}`}
        style={{ 
          position: 'absolute',
          top: `${top}px`, 
          height: `${slotHeight}px`, // Zakładamy wysokość jednego slotu
          width: '100%',
          display: 'flex',
          cursor: 'pointer',
          gap: '2px'
        }}
        onClick={() => !isPast && !isFull && currentUser?.role === "user" && setIsModalOpen(true)}
      >
        {isFull ? "Termin Zajęty" : "Termin Wolny"}
      </div>

      {isModalOpen && (
          <AppointmentModal 
            // key={`${currentUserId}-${currentDoctorId}`}
            time={startTime}
            appointments={appointments} 
            onClose={() => setIsModalOpen(false)} 
          />
      )}
    </>
  );
};