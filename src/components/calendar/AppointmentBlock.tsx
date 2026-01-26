import React from 'react';
import { format, isBefore } from 'date-fns';
import type { Appointment } from '../types';
import './AppointmentBlock.css';

interface Props {
  appointments: Appointment[]; // Tablica z grupy o tej samej godzinie
  slotHeight: number;
  startHour: number; // Musisz to przekazać, żeby dobrze policzyć 'top'
}

export const AppointmentBlock: React.FC<Props> = ({ appointments, slotHeight, startHour }) => {
  const firstApp = appointments[0];
  const startTime = new Date(firstApp.startTime);
  const isPast = startTime < new Date();
  
  // 1. Obliczamy pozycję (relatywną do startu kalendarza)
  const startMinutes = (startTime.getHours() - startHour) * 60 + startTime.getMinutes();
  const top = (startMinutes / 30) * slotHeight;
  
  // 2. Czy slot jest zajęty?
  const isFull = appointments.every(app => app.userId !== "");

  
  const handleClick = () => {
    
  };

  return (
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
      onClick={!isPast && !isFull ? handleClick : undefined}
    >
      {isFull ? "Termin Zajęty" : "Termin Wolny"}
    </div>
  );
};