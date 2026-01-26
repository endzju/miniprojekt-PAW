import React from 'react';
import { addHours, isSameDay, isWithinInterval } from 'date-fns';
import type { Appointment, TimeSlot } from '../types';
import { AppointmentBlock } from './AppointmentBlock';

interface Props {
  day: Date;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  slotHeight: number;
  startHour: number;
  shownHours: number;
}

export const DayColumn: React.FC<Props> = ({ day, timeSlots, appointments, slotHeight, startHour, shownHours }) => {
  const isToday = isSameDay(day, new Date());
  const dailyAppointments = appointments.filter(app => {
    const appDate = new Date(app.startTime);
    return isSameDay(appDate, day);
  })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const groupedAppointments = dailyAppointments.reduce((acc, app) => {
    const time = app.startTime;
    const appTime = new Date(time);
    if (appTime.getHours() < startHour || appTime.getHours() >= startHour + shownHours){
      return acc;
    }
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(app);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // 2. Zamiana obiektu z powrotem na tablicę grup, żeby móc użyć .map()
  const groups = Object.values(groupedAppointments);

  return (
    <div className={`day-column ${isToday ? 'today-col' : ''}`}>
      {timeSlots.map(slot => (
        <div key={slot.label} className={`slot-grid-line ${slot.hours % 4 === 0 ? 'color-slot' : ''}`} style={{ height: slotHeight }} />
      ))}

      {groups.map(group => (
        <AppointmentBlock 
          key={group[0].startTime} // Kluczem jest czas startu grupy
          appointments={group}      // Przekazujemy listę wizyt z tej godziny
          slotHeight={slotHeight} 
          startHour={startHour}
        />
      ))}
    </div>
  );
};