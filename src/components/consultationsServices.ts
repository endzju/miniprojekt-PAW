import type { Appointment, Person } from './types';
import { isSameDay } from 'date-fns';
import { collection, getDocs, getDoc, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { fireDb } from "../FirebaseConfig"; // Ścieżka do Twojego pliku

export const fetchAppointments = async (db: string): Promise<Appointment[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/appointments');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Appointment[] = await response.json();
    return data;
  } else if (db === 'firebase') {
    const querySnapshot = await getDocs(collection(fireDb, "appointments"));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Appointment[];
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
  } else if (db === 'firebase') {
    const querySnapshot = await getDocs(collection(fireDb, "doc_availability"));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Appointment[];
  }
  return [];
};

export const fetchDoctorAvailabilityByDate = async (db: string, date: Date): Promise<Appointment[]> => {

  const appointments: Appointment[] = await fetchDoctorAvailability(db);
  return appointments.filter(app => isSameDay(new Date(app.startTime), date));

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
  } else if (db === 'firebase') {
  const q = query(
    collection(fireDb, "canceled_appointments"), 
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  })) as Appointment[];
  return data;
  }
  return [];
}


export const getAllAppointmentsByDate = async (db: string, date: Date): Promise<Appointment[]> => {
  const appointments = await fetchAllAppointments(db);
  return appointments.filter(app => isSameDay(new Date(app.startTime), date));
};

export const addDoctorAvailability = async (db: string, appointments: Appointment[]) => {
  const currentAppointments = await fetchDoctorAvailability(db);
  const existingKeys = new Set(
    currentAppointments.map(app => `${app.doctorId}_${app.startTime}`)
  );
  const uniqueNewAppointments = appointments.filter(app => {
    const key = `${app.doctorId}_${app.startTime}`;
    return !existingKeys.has(key);
  });

  if (db === 'local') {
  const requests = uniqueNewAppointments.map(appointment => {
    const clearAppointment: Appointment = {
      ...appointment,
      paid: false,
      userId: '',
      firstName: '',
      lastName: ''
    };
    const { id, ...clearData } = clearAppointment;
    fetch('http://localhost:5000/doc_availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clearData),
    })
  });
  await Promise.all(requests);
  } else if (db === 'firebase') {
    const requests = uniqueNewAppointments.map(appointment => {
      const updatedAppointment: Appointment = {
        ...appointment,
        paid: false,
        userId: '',
        firstName: '',
        lastName: ''
      };
      const { id, ...clearData } = updatedAppointment;
      return addDoc(collection(fireDb, "doc_availability"), clearData);
    });
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
  } else if (db === 'firebase') {
    const requests = appointments.map(appointment => {
      if (!appointment.id) return Promise.resolve();
      return deleteDoc(doc(fireDb, "doc_availability", appointment.id));
    });
    await Promise.all(requests);
  }
}

export const getUnpaidAppointments = async (db: string, userId: string): Promise<Appointment[]> => {
  const appointments = await fetchAppointments(db);
  return appointments.filter(app => app.userId === userId && !app.paid);
}

export const getPaidAppointments = async (db: string, userId: string): Promise<Appointment[]> => {
  const appointments = await fetchAppointments(db);
  return appointments.filter(app => app.userId === userId && app.paid);
}

export const getDoctors = async (db: string): Promise<Person[]> => {
  if (db === 'local') {
    const response = await fetch('http://localhost:5000/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Person[] = await response.json();
    const doctors: Person[] = data.filter(person => person.role === 'doctor');
    return doctors;
  } else if (db === 'firebase') {
    const q = query(
      collection(fireDb, "users"), 
      where("role", "==", "doctor")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Person[];
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
  } else if (db === 'firebase') {
    const requests = appointments.map(appointment => {
      if (!appointment.id) return Promise.resolve();
      return deleteDoc(doc(fireDb, "appointments", appointment.id));
    });
    await Promise.all(requests);
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
  } else if (db === 'firebase') {
    const requests = appointments.map(appointment => {
      const { id, ...dataWithoutId } = appointment;
      return addDoc(collection(fireDb, "canceled_appointments"), dataWithoutId);
    });
    await Promise.all(requests);
  }
}

export const addAppointments = async (db: string, appointments: Appointment[]) => {
  if (db === 'local') {
    for (const appointment of appointments) {
      const { id, ...dataWithoutId } = appointment;
      await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithoutId),
      });
    }
  } else if (db === 'firebase') {
    const requests = appointments.map(appointment => {
      const { id, ...dataWithoutId } = appointment;
      return addDoc(collection(fireDb, "appointments"), dataWithoutId);
    });
    await Promise.all(requests);
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

export const getUser = async (db: string, userId: string): Promise<Person> => {
  if (db === 'local') {
    const response = await fetch(`http://localhost:5000/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json() as Person;
  } else if (db === 'firebase') {
    const docRef = doc(fireDb, "users", userId);
    const docSnap = await getDoc(docRef);
    const rawData = docSnap.data() as Omit<Person, 'id'>;
    const data = { 
      id: docSnap.id, 
      ...rawData 
    } as Person;
    const { password, ...personData } = data;

return personData as Person;

  } else {
    throw new Error("Nie ma takiego użytkownika!");
  }
}

export const getDoctorsMap = async (db: string): Promise<Map<string, string>> => {
  const doctorsArray: Person[] = await getDoctors(db);
  const dMap = new Map<string, string>();
  doctorsArray.forEach(doctor => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`;
    dMap.set(doctor.id || '', fullName);
  });
  return dMap;
};

export const getLocalUser = async (email: string, password: string): Promise<Person | null> => {
  const response = await fetch('http://localhost:5000/users');
  if (!response.ok) throw new Error('Network response was not ok');
  const data: Person[] = await response.json();
  const user = data.find(person => person.email === email && person.password === password);
  return user || null;
};

export const addLocalUser = async (user: Person) => {
  await fetch('http://localhost:5000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
};
