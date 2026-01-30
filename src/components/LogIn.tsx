import React, { useState } from 'react';
import { auth } from '../FirebaseConfig';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useAppContext } from './AppContext';
import { getLocalUser } from './consultationsServices';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { db, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const { db, setCurrentUser } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (db === 'firebase'){
      try {
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);

        navigate('/');
        alert("Zalogowano!");
      } catch (err) {
        setError("Błąd logowania");
      }
    } else if (db === 'local') {
      try {
        const curUser = await getLocalUser(email, password);
        if (curUser) {
          setCurrentUser(curUser);
          navigate('/'); 
          alert("Zalogowano!");
        } else {
          setError("Błędne dane logowania");
        }
      } catch (err) {
        setError("Błąd logowania");
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section className='auth-container'>
        <h1>Logowanie</h1>
        <form onSubmit={handleLogin} className='auth-form'>
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
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <button type="submit">Zaloguj</button>
        </form>
        <p>Nie masz konta? 
          <button className='auth-button' onClick={() => navigate('/register')}>Zarejestruj się</button>
        </p>
      </section>
    </div>
  );
};

export default LogIn;