export type AppointmentType = 'pierwsza wizyta' | 'wizyta kontrolna' | 'choroba przewlekła' | 'recepta' | "";

export interface Appointment {
  id?: string;
  userId: string;
  doctorId: string;
  startTime: string;
  firstName: string;
  lastName: string;
  appointmentType: AppointmentType;
  phoneNumber?: string;
  paid: boolean;
  gender?: string;
  age?: string;
  info?: string;
}

export interface TimeSlot {
  hours: number;
  minutes: number;
  label: string;
}

export interface Person {
  id: string;
  login?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
}