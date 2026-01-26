import React, { useState } from 'react';
import { format } from 'date-fns';
import './AppointmentModal.css';

interface ModalProps {
  time: Date;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const AppointmentModal: React.FC<ModalProps> = ({ time, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    doctor: 'dr Jan Kowalski'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return alert("Wpisz dane pacjenta!");
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3>Nowa Wizyta: {format(time, 'HH:mm')}</h3>
        
        <input 
          placeholder="Imię"
          value={formData.firstName}
          onChange={e => setFormData({...formData, firstName: e.target.value})}
        />
        <input 
          placeholder="Nazwisko"
          value={formData.lastName}
          onChange={e => setFormData({...formData, lastName: e.target.value})}
        />

        <select 
          value={formData.doctor}
          onChange={e => setFormData({...formData, doctor: e.target.value})}
        >
          <option>dr Jan Kowalski</option>
          <option>dr Anna Nowak</option>
          <option>dr Stefan Zapominalski</option>
        </select>

        <div className="modal-actions">
          <button type="submit" className="save-btn">Zapisz wizytę</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </div>
  );
};