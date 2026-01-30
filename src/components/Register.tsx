import React, { useState } from 'react';
import { auth, fireDb } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';
import { getUser, addLocalUser } from './consultationsServices';
import './Auth.css';
import type { Person } from './types';

// --- LOGIKA REJESTRACJI ---
const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { db, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      return setError("Hasła nie są identyczne!");
    }
    if (db === 'firebase') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(fireDb, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          login: login,
          role: "user"
        });
        const curUser = await getUser(db, user.uid);
        setCurrentUser(curUser);
        navigate('/');
        alert("Konto stworzone!");
      } catch (err) {
        setError("Błąd rejestracji");
      }
    } else if (db === 'local') {
      try {
        const user = { firstName, lastName, login, email, password, role: "user" } as Person;
        await addLocalUser(user);
        setCurrentUser(user);
        navigate('/'); 
        alert("Konto stworzone!");
      } catch (err) {
        setError("Błąd rejestracji");
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section className='auth-container'>
        <h1>Rejestracja</h1>
        <form onSubmit={handleRegister} className='auth-form'>
          <label>Imie:</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />

          <label>Nazwisko:</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />

          <label>Login:</label>
          <input 
            type="text" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
            required 
          />

          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <label>Hasło:</label>
          <input 
            type="password" 
            value={password} 
            minLength={6}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <label>Powtórz hasło:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          
          <button type="submit">Stwórz konto</button>
        </form>
        <p>Masz już konto? 
          <button className='auth-button' onClick={() => navigate('/login')}>Zaloguj się</button>
        </p>
      </section>
    </div>
  );
};

export default Register;