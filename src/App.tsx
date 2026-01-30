import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import Layout from './components/Layout';
import Calendar from './components/calendar/Calendar';
import Options from './components/Options';
import DoctorSchedule from './components/DoctorSchedule';
import CanceledAppointments from './components/CanceledAppointments';
import Cart from './components/Cart';
import Appointments from './components/Appointments';
import LogIn from './components/LogIn';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRegisterDoctor from './components/AdminRegisterDoctor';
import DoctorsList from './components/DoctorList';

const Home = () => <h1>Strona Główna</h1>;
const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "doctorList", element: <DoctorsList />},
        { path: "availability", element:
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorSchedule />
          </ProtectedRoute>
        },
        { path: "calendar", element:
          <ProtectedRoute allowedRoles={['user', 'doctor']}>
            <Calendar />
          </ProtectedRoute>
        },
        { path: "options", element:
          <ProtectedRoute allowedRoles={['admin']}>
            <Options />
          </ProtectedRoute>
        },
        { path: "cart", element:
          <ProtectedRoute allowedRoles={['user']}>
            <Cart />
          </ProtectedRoute>
        },
        { path: "appointments", element: 
          <ProtectedRoute allowedRoles={['user', 'doctor']}>
            <Appointments />
          </ProtectedRoute>
        },
        { path: "canceledAppointments", element: 
          <ProtectedRoute allowedRoles={['user']}>
            <CanceledAppointments />
          </ProtectedRoute>
        },
        { path: "registerDoctor", element: 
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRegisterDoctor />
          </ProtectedRoute>
        },
        { path: "login", element: <LogIn /> },
        { path: "register", element: <Register /> },
      ],
    }
  ]);
function AppRouter() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}