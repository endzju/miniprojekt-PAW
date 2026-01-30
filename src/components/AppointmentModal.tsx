import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // Ważny import!
import { format } from 'date-fns';
import type { Appointment, AppointmentType } from './types';
import { useAppContext } from './AppContext';
import { removeDoctorAvailability, addAppointments } from './consultationsServices';

import './AppointmentModal.css';

interface ModalProps {
  time: Date;
  appointments: Appointment[];
  onClose: () => void;
}

export const AppointmentModal: React.FC<ModalProps> = ({ time, appointments, onClose}) => {
  const [formData, setFormData] = useState<{
  firstName: string;
  lastName: string;
  doctorId: string;
  phoneNumber: string;
  appointmentType: AppointmentType;
  gender?: string;
  age?: string;
  info?: string;
}>({
  firstName: '',
  lastName: '',
  doctorId: '',
  phoneNumber: '',
  appointmentType: '',
  gender: '',
  age: '',
  info: '',
});
  const { db, doctorsMap, currentUser, refresh, setRefresh } = useAppContext();
  const emptyAppointments = appointments.filter(app => app.userId === "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundAppointment = appointments.find(app => app.doctorId === formData.doctorId);
    if (!foundAppointment) {
      console.error("Nie znaleziono wizyty dla tego lekarza!");
      return;
    }
    removeDoctorAvailability(db, [foundAppointment]);
    const newAppointment: Appointment = { ...foundAppointment, ...formData, paid: false, userId: currentUser?.id || '' };
    addAppointments(db, [newAppointment]);
    onClose();
    setRefresh(refresh + 1);
  };
  return createPortal(
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3>Nowa Wizyta: {format(time, 'HH:mm')}</h3>

        <select 
          value={formData.doctorId} 
          onChange={e => setFormData({...formData, doctorId: e.target.value})}
          required
        >
          <option value="">Wybierz lekarza...</option>
          
          {emptyAppointments.map((app) => (
            <option key={app.doctorId} value={app.doctorId}>
              {doctorsMap.get(app.doctorId) 
                ? `${doctorsMap.get(app.doctorId)?.firstName} ${doctorsMap.get(app.doctorId)?.lastName}`
                : `błędne id lekarza`
              }
            </option>
          ))}
        </select>
        
        <input 
          placeholder="Imię"
          value={formData.firstName}
          required
          onChange={e => setFormData({...formData, firstName: e.target.value})}
        />
        <input 
          placeholder="Nazwisko"
          value={formData.lastName}
          required
          onChange={e => setFormData({...formData, lastName: e.target.value})}
        />
        <input
          placeholder="Wiek"
          value={formData.age}
          required
          pattern="[0-9]+"
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '');
            setFormData({...formData, age: val});
            }
          }
        />
        <select 
          value={formData.gender} 
          required
          onChange={e => setFormData({...formData, gender: e.target.value})}
        >
          <option value="">Wybierz płęć...</option>
          <option value="M">Mezczyzna</option>
          <option value="K">Kobieta</option>
        </select>

        <input 
          placeholder="Numer telefonu"
          value={formData.phoneNumber}
          required
          pattern="[0-9]+"
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '');
            setFormData({...formData, phoneNumber: val});
            }
          }
        />
        <select 
          value={formData.appointmentType} 
          required
          onChange={e => setFormData({...formData, appointmentType: e.target.value as AppointmentType})}
        >
          <option value="">Wybierz typ wizyty...</option>
          <option value="pierwsza wizyta">Pierwsza wizyta</option>
          <option value="wizyta kontrolna">Wizyta kontrolna</option>
          <option value="choroba przewlekła">Choroba przewlekła</option>
          <option value="recepta">Recepta</option>
        </select>
        <input 
          placeholder="Opis"
          value={formData.info}
          type="textarea"
          onChange={e => setFormData({...formData, info: e.target.value})}
        />

        <div className="modal-actions">
          <button type="submit" className="save-btn">Zapisz</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </div>,
    document.body
  );
};