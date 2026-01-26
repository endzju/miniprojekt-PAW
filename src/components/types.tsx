export type AppointmentType = 'pierwsza wizyta' | 'wizyta kontrolna' | 'choroba przewlekła' | 'recepta' | "";

export interface Appointment {
  id?: string;
  userId: string;
  doctorId: string;
  startTime: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  appointmentType: AppointmentType;
  paid: boolean;
}

export interface TimeSlot {
  hours: number;
  minutes: number;
  label: string;
}

export interface Person {
  id?: string;
  login?: string;
  password?: string;
  firstName: string;
  lastName: string;
}