import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthNav.css';
import { useAppContext } from './AppContext';
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";

// Definiujemy strukturę danych użytkownika
const AuthNav: React.FC = () => {
  // Stan może być obiektem User lub null (gdy nikt nie jest zalogowany)

  // Przykładowe funkcje logowania/wylogowania
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAppContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); 
      alert("Wylogowano pomyślnie!");
    } catch (err) {
      console.error("Błąd podczas wylogowywania:", err);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '16px', right: '16px'}}>
      {currentUser ? (
        /* Widok dla zalogowanego */
        <div className="gapRow10">
          <span>
            <strong>
              {currentUser.role === 'doctor' 
                ? `${currentUser.firstName} ${currentUser.lastName}` 
                : currentUser.login}
            </strong>
          </span>
          
          <button className='auth-button' onClick={handleLogout}>Wyloguj</button>
        </div>
      ) : (
        /* Widok dla gościa */
        <div className="gapRow10">
          <button className='auth-button' onClick={() => navigate('/login')}>Zaloguj się</button>
          <button className='auth-button' onClick={() => navigate('/register')}>Rejestracja</button>
        </div>
      )}
    </div>
  );
};

export default AuthNav;