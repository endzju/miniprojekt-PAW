import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isWithinInterval } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment, TimeSlot } from '../types';
import { DayColumn } from './DayColumn';
import './Calendar.css';
import { AppointmentModal } from '../AppointmentModal';
import { useAppContext } from '../AppContext';
import { fetchAllAppointments } from '../consultationsServices';

const SLOT_HEIGHT = 40;

const Calendar: React.FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startHour, setStartHour] = useState(6);
  const [shownHours, setShownHours] = useState(6);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { db } = useAppContext();
  // const { currentUserId, setCurrentUserId } = useAppContext();

  useEffect(() => {
    setIsLoading(true);
    fetchAllAppointments(db)
      .then(data => setAppointments(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [db]);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), 
  [currentWeekStart]);


  const timeSlots: TimeSlot[] = useMemo(() => 
  Array.from({ length: 2 * shownHours }, (_, i) => {
    const totalHours = Math.floor(i / 2) + startHour;
    const minutes = (i % 2) * 30;

    const endMinutes = minutes === 0 ? 30 : 0;
    const endHours = minutes === 30 ? totalHours + 1 : totalHours;

    // Pomocnicza funkcja do ładnego formatowania "00"
    const formatTime = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return {
      hours: totalHours,
      minutes: minutes,
      label: `${formatTime(totalHours, minutes)} - ${formatTime(endHours, endMinutes)}`
    };
  }), [shownHours, startHour]);

  if (isLoading) return <div>Ładowanie danych z bazy {db}...</div>;
  if (error) return <div>Błąd: {error}</div>;
  return (
    <div className="calendar-container">
      {/* Header Navigation */}
      <div className="calendar-nav">
        <div className="nav-top-row">
          <button onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}>&lt;</button>
          <h2>{format(currentWeekStart, 'LLLL yyyy', { locale: pl })}</h2>
          <button onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}>&gt;</button>
        </div>
          <button 
            className="show-earlier-btn"
            onClick={() => {
              if (startHour > 0) {
                // Rozwiń do góry (do północy)
                setStartHour(0);
                setShownHours(shownHours + 6);
              } else {
                // Zwiń z powrotem do 08:00
                setStartHour(6);
                setShownHours(shownHours - 6); 
              }
            }}
          >
            {startHour > 0 ? "↑ Wyświetl wcześniejsze godziny" : "↓ Ukryj wcześniejsze godziny"}
          </button>
      </div>

      

      <div className="calendar-grid">
        <div className="grid-header-cell hour-cell"><strong>Godzina</strong></div>
        {days.map(day => (
          <div key={day.toISOString()} className="grid-header-cell">
            <strong>{format(day, 'EEEE', { locale: pl })}</strong>
            <div>{format(day, 'dd.MM')}</div>
          </div>
        ))}

        {/* Time Labels Column */}
        <div className="time-column">
          {timeSlots.map(slot => (
            <div key={slot.label} className="time-slot-label" style={{ height: SLOT_HEIGHT }}>
              {slot.label}
            </div>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="calendar-body">
          {/* Time Marker */}
          {isWithinInterval(currentTime, { start: currentWeekStart, end: addDays(currentWeekStart, 7) }) && 
          (currentTime.getHours() < startHour + shownHours) &&
          (
            <div 
              className="current-time-marker" 
              style={{ top: `${((currentTime.getHours() - startHour) * 60 + currentTime.getMinutes()) * (SLOT_HEIGHT / 30)}px` }}
            />
            
          )}
          {days.map(day => (
            <DayColumn 
              key={day.toISOString()} 
              day={day} 
              timeSlots={timeSlots} 
              appointments={appointments} 
              slotHeight={SLOT_HEIGHT}
              startHour={startHour}
              shownHours={shownHours}
            />
          ))}
        </div>
      </div>
      <div className="nav-bot-row">
        {/* Wyświetl tylko jeśli nie doszliśmy do końca doby */}
        {startHour + shownHours < 24 && (
          <button 
            className="show-hours-btn"
            onClick={() => setShownHours(shownHours + 6)}
          >
            ↓ Wyświetl późniejsze godziny
          </button>
        )}

        {/* Wyświetl tylko jeśli kalendarz jest większy niż minimum (np. 6h) */}
        {startHour + shownHours > 12 && (
          <button 
            className="show-hours-btn"
            onClick={() => setShownHours(shownHours - 6)}
          >
            ↑ Ukryj późniejsze godziny
          </button>
        )}
      </div>
    </div>
  );
};

export default Calendar;