import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import Layout from './components/Layout';
import Calendar from './components/calendar/Calendar';
import Options from './components/Options';
import DoctorSchedule from './components/DoctorSchedule';
import CanceledAppointments from './components/CanceledAppointments';
import Cart from './components/Cart';

const Home = () => <h1>Strona Główna</h1>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "availability", element: <DoctorSchedule /> },
      { path: "calendar", element: <Calendar /> },
      { path: "options", element: <Options /> },
      { path: "cart", element: <Cart /> },
      { path: "canceled appointments", element: <CanceledAppointments /> },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}