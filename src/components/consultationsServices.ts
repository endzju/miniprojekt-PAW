import type { Appointment, Person } from './types';
import { isSameDay } from 'date-fns';

export const fetchAppointments = async (db: string): Promise<Appointment[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/appointments');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Appointment[] = await response.json();
    return data;
  }
  return [];
};

export const fetchDoctorAvailability = async (db: string): Promise<Appointment[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/doc_availability');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Appointment[] = await response.json();
    return data;
  }
  return [];
};

export const fetchDoctorAvailabilityByDate = async (db: string, date: Date): Promise<Appointment[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/doc_availability');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const appointments: Appointment[] = await response.json();
    return appointments.filter(app => isSameDay(new Date(app.startTime), date));
  }
  return [];
};

export const fetchAllAppointments = async (db: string): Promise<Appointment[]> => {

  const [appointments, availability] = await Promise.all([
    fetchAppointments(db),
    fetchDoctorAvailability(db)
  ]);
  return [...appointments, ...availability];

};

export const fetchCanceledAppointmentsByUser = async (db: string, userId: string): Promise<Appointment[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/canceled_appointments');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Appointment[] = await response.json();
    return data.filter(app => app.userId === userId);
  }
  return [];
}


export const getAllAppointmentsByDate = async (db: string, date: Date): Promise<Appointment[]> => {
  const appointments = await fetchAllAppointments(db);
  return appointments.filter(app => isSameDay(new Date(app.startTime), date));
};

export const addDoctorAvailability = async (db: string, appointments: Appointment[]) => {
  const currentAppointments = await fetchDoctorAvailability(db);
  const existingTimes = new Set(currentAppointments.map(app => app.startTime));
  const uniqueNewAppointments = appointments.filter(app => !existingTimes.has(app.startTime));

  if (db === 'local') {
  const requests = uniqueNewAppointments.map(appointment => 
    fetch('http://localhost:5000/doc_availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    })
  );
  await Promise.all(requests);
  }
};
export const removeDoctorAvailability = async (db: string, appointments: Appointment[]) => {
  if (db === 'local') {
    for (const appointment of appointments) {
      await fetch(`http://localhost:5000/doc_availability/${appointment.id}`, {
        method: 'DELETE',
      });
    }
  }
}

export const getUnpaindAppointments = async (db: string, userId: string): Promise<Appointment[]> => {
  const appointments = await fetchAppointments(db);
  return appointments.filter(app => app.userId === userId && !app.paid);
}

export const getPaindAppointments = async (db: string, userId: string): Promise<Appointment[]> => {
  const appointments = await fetchAppointments(db);
  return appointments.filter(app => app.userId === userId && app.paid);
}

export const getDoctors = async (db: string): Promise<Person[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/doctors');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Person[] = await response.json();
    return data;
  }
  return [];
}

export const removeAppointments = async (db: string, appointments: Appointment[]) => {
  if (db === 'local') {
    for (const appointment of appointments) {
      await fetch(`http://localhost:5000/appointments/${appointment.id}`, {
        method: 'DELETE',
      });
    }
  }
}

export const addCanceledAppointments = async (db: string, appointments: Appointment[]) => {
  if (db === 'local') {
    for (const appointment of appointments) {
      const { id, ...dataWithoutId } = appointment;
      await fetch('http://localhost:5000/canceled_appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithoutId),
      });
    }
  }
}

export const removeDoctorAvailabilityByDate = async (db: string, day: Date, docId: string) => {
  const currentAppointments: Appointment[] = await fetchDoctorAvailabilityByDate(db, day);
  const filteredAppointments = currentAppointments.filter(app => app.doctorId === docId);
  await removeDoctorAvailability(db, filteredAppointments);
  const currentPlannedAppointments: Appointment[] = await fetchAppointments(db);
  const filteredPlannedAppointments = currentPlannedAppointments
    .filter(app => app.doctorId === docId && isSameDay(new Date(app.startTime), day));
  await addCanceledAppointments(db, filteredPlannedAppointments);
  await removeAppointments(db, filteredPlannedAppointments);
};