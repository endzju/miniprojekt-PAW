import React, { useState } from 'react';
import { firebaseConfig, fireDb } from '../FirebaseConfig'; // Twoja stała konfiguracja bazy
import { initializeApp, deleteApp } from "firebase/app"; 
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  inMemoryPersistence, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import './Auth.css';
import { addLocalUser } from './consultationsServices';
import { useAppContext } from './AppContext';
import type { Person } from './types';

const AdminRegisterDoctor = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { db } = useAppContext();

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (db === 'firebase') {
      try {
        const tempApp = initializeApp(firebaseConfig, "TempAdminAction");
        const tempAuth = getAuth(tempApp);
        await tempAuth.setPersistence(inMemoryPersistence);
        const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
        const doctorUid = userCredential.user.uid;

        await setDoc(doc(fireDb, "users", doctorUid), {
          firstName,
          lastName,
          email,
          role: "doctor",
          login
        });

        await signOut(tempAuth);
        await deleteApp(tempApp);

        alert(`Sukces! Doktor ${firstName} ${lastName} został dodany do bazy.`);
        
        // Reset pól
        setFirstName(''); setLastName(''); setLogin(''); setEmail(''); setPassword('');

      } catch (err: any) {
        console.error(err);
        alert("Błąd: " + err.message);
      } finally {
        setLoading(false);
      }
    } else if (db === 'local') {
      try {
        const doctor = { firstName, lastName, email, login, password, role: "doctor" } as Person;
        await addLocalUser(doctor);
        alert(`Sukces! Doktor ${firstName} ${lastName} został dodany do bazy.`);
        setFirstName(''); setLastName(''); setLogin(''); setEmail(''); setPassword('');
      } catch (err: any) {
        console.error(err);
        alert("Błąd: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className='auth-container doctor-admin-panel'>
      <h1>Rejestracja Doktora:</h1>
      <form onSubmit={handleRegisterDoctor} className='auth-form'>
        <label>Imię:</label>
        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />

        <label>Nazwisko:</label>
        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />

        <label>Login:</label>
        <input type="text" value={login} onChange={e => setLogin(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Hasło:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? "Dodawanie do bazy..." : "Zarejestruj Doktora"}
        </button>
      </form>
    </section>
  );
};

export default AdminRegisterDoctor;