import React from 'react';
import { useAppContext } from './AppContext';


const Options: React.FC = () => {
  const { db, setDb } = useAppContext();
  const databaseOptions = [
    { id: 'local', label: 'Baza Lokalna (JSON)' },
    { id: 'production', label: 'Baza Produkcyjna' },
    { id: 'test', label: 'Baza Testowa' }
  ];

  return (
    <div className="options-container" style={{ margin: '10px 0', textAlign: 'center' }}>
      <label htmlFor="db-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Źródło danych:
      </label>
      <select 
        id="db-select"
        value={db} 
        onChange={(e) => setDb(e.target.value)}
        style={{ padding: '5px', borderRadius: '4px' }}
      >
        {databaseOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Options;