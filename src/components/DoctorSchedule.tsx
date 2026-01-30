import React, { useState } from 'react';
import { 
  format, 
  parseISO, 
  eachDayOfInterval, 
  getDay, 
  isValid 
} from 'date-fns';
import { useAppContext } from './AppContext'; // Ścieżka do Twojego kontekstu
import { addDoctorAvailability, removeDoctorAvailabilityByDate } from './consultationsServices';
import type { Appointment } from './types';
import './DoctorSchedule.css';

interface TimeRange {
  start: string;
  end: string;
}

const WEEKDAYS = [
  { label: 'Pn', value: 1 },
  { label: 'Wt', value: 2 },
  { label: 'Śr', value: 3 },
  { label: 'Czw', value: 4 },
  { label: 'Pt', value: 5 },
  { label: 'Sob', value: 6 },
  { label: 'Nd', value: 0 },
];

const DoctorSchedule = () => {
  const { db, currentUser } = useAppContext();
  
  // Tryb: jednorazowy / cykliczny
  const [isRecurring, setIsRecurring] = useState(false);
  
  // Daty
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteDate, setDeleteDate] = useState('');
  
  // Maska dni (wybrane dni tygodnia)
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  
  // Dynamiczna maska godzin (wiele przedziałów)
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ start: '08:00', end: '16:00' }]);

  // Zarządzanie przedziałami godzinowymi
  const addTimeRange = () => setTimeRanges([...timeRanges, { start: '08:00', end: '16:00' }]);
  const removeTimeRange = (index: number) => setTimeRanges(timeRanges.filter((_, i) => i !== index));
  const updateTimeRange = (index: number, field: keyof TimeRange, value: string) => {
    const newRanges = [...timeRanges];
    newRanges[index][field] = value;
    setTimeRanges(newRanges);
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeRanges.length) return alert("Proszę podać przynajmniej jeden przedział czasowy.");

    const start = parseISO(startDate);
    const end = isRecurring ? parseISO(endDate) : start;

    if (!isValid(start) || (isRecurring && !isValid(end))) {
      return alert("Proszę podać poprawne daty.");
    }

    const appointments: Appointment[] = [];
    const interval = eachDayOfInterval({ start, end });

    interval.forEach(day => {
      // Sprawdź maskę dni tygodnia (tylko w trybie cyklicznym)
      if (isRecurring && !selectedDays.includes(getDay(day))) return;

      timeRanges.forEach(range => {
        console.log(range);
        if (range.start && range.end && range.start < range.end) {
          const [startHour, startMin] = range.start.split(':').map(Number);
          const [endHour, endMin] = range.end.split(':').map(Number);
          let current = new Date(day); // Kopiujemy datę wybranego dnia
          current.setHours(startHour, startMin, 0, 0);
          const finish = new Date(day);
          finish.setHours(endHour, endMin, 0, 0);
          while (current < finish){
            appointments.push({
              userId: "",
              doctorId: currentUser?.id || '',
              startTime: format(current, "yyyy-MM-dd'T'HH:mm"),
              firstName: "",
              lastName: "",
              phoneNumber: "",
              appointmentType: "",
              paid: false
            });
            current.setMinutes(current.getMinutes() + 30);
          }
        }
      });
    });
    const uniqueAppointments = Array.from(
      new Map(appointments.map(app => [`${app.doctorId}_${app.startTime}`, app])).values()
    );

    try {
      await addDoctorAvailability(db, uniqueAppointments);
      alert(`Dodano terminy pomyślnie.`);
    } catch (err) {
      alert("Wystąpił błąd podczas zapisu.");
    }
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await removeDoctorAvailabilityByDate(db, new Date(deleteDate), currentUser?.id || '');
      alert(`Dodano absencję pomyślnie.`);
    } catch (err) {
      alert("Wystąpił błąd podczas zapisu.");
    }
  };

  return (
    <div className="bothContainers">
      <div className="">
        <h2 className="">Ustawianie dostępności lekarza</h2>
        
        <form onSubmit={handleSubmit} className="gapCol10">
          {/* Przełącznik trybu */}
          <div className="gapRow10">
            <button
              type="button"
              className=""
              onClick={() => setIsRecurring(false)}
            >Jednorazowe</button>
            <button
              type="button"
              className=""
              onClick={() => setIsRecurring(true)}
            >Cykliczne</button>
          </div>

          {/* Sekcja Dat */}
          <div className="gapRow10">
            <div>
              <label className="">Od kiedy / Data: </label>
              <input 
                type="date" 
                required
                className="" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            {isRecurring && (
              <div>
                <label className="">Do kiedy: </label>
                <input 
                  type="date" 
                  required
                  className="" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Maska Dni Tygodnia (Cykliczne) */}
          {isRecurring && (
            <div className="gapCol10">
              <label className="">Dni konsultacji:</label>
              <div className="gapRow10">
                {WEEKDAYS.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`${selectedDays.includes(day.value) ? 'daySelected' : ''}`}
                  > {day.label} </button>
                ))}
              </div>
            </div>
          )}

          <div className="gapCol10">
            <label className="">Godziny konsultacji (przedziały):</label>
            {timeRanges.map((range, index) => (
              <div key={index} className="">
                <div className="gapRow10">
                  {/* Wybór godziny */}
                  <select 
                    value={range.start.split(':')[0] || '08'} 
                    onChange={(e) => {
                      const mins = range.start.split(':')[1] || '00';
                      updateTimeRange(index, 'start', `${e.target.value}:${mins}`);
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return <option key={hour} value={hour}>{hour}</option>;
                    })}
                  </select>

                  <span>:</span>
                  <select 
                    value={range.start.split(':')[1] || '00'} 
                    onChange={(e) => {
                      const hour = range.start.split(':')[0] || '08';
                      updateTimeRange(index, 'start', `${hour}:${e.target.value}`);
                    }}
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <span>do</span>
                  <select 
                    value={range.end.split(':')[0] || '16'} 
                    onChange={(e) => {
                      const mins = range.end.split(':')[1] || '00';
                      updateTimeRange(index, 'end', `${e.target.value}:${mins}`);
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return <option key={hour} value={hour}>{hour}</option>;
                    })}
                  </select>

                  <span>:</span>
                  <select 
                    value={range.end.split(':')[1] || '00'} 
                    onChange={(e) => {
                      const hour = range.end.split(':')[0] || '16';
                      updateTimeRange(index, 'end', `${hour}:${e.target.value}`);
                    }}
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => removeTimeRange(index)}
                    className=""
                  >X
                  </button>
                  
                </div>
                
              </div>
            ))}
            <button 
              type="button" 
              onClick={addTimeRange}
              className=""
              style={{width: '350px'}}
            >+ Dodaj kolejny przedział godzinowy</button>
          </div>

          <button 
            type="submit" 
            className=""
            style={{ width: '200px' }}
          >
            Zatwierdź grafik
          </button>
        </form>
      </div>
      <div>
        <h2 className="">Absencje lekarza</h2>
        <div className="gapCol10">
          <form onSubmit={handleSubmit1} className="gapCol10">
            <div className="gapCol10">
              <label className="">Data: </label>
              <input 
                type="date" 
                required
                className="" 
                value={deleteDate} 
                onChange={e => setDeleteDate(e.target.value)}
              />
              <button 
                type="submit" 
                className=""
                style={{ width: '200px' }}
              >
                Dodaj absencje
              </button>
            </div>
          </form>
        </div>
      

      </div>

    </div>
  );
};

export default DoctorSchedule;