import React from 'react';
import { useAppContext } from './AppContext';


const Options: React.FC = () => {
  const { db, handleDbChange } = useAppContext();
  const databaseOptions = [
    { id: 'local', label: 'Baza Lokalna (JSON)' },
    { id: 'firebase', label: 'Firebase' },
    { id: '', label: '-' }
  ];

  return (
    <div className="options-container" style={{ margin: '10px 0', textAlign: 'center' }}>
      <label htmlFor="db-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
        Źródło danych:
      </label>
      <select 
        id="db-select"
        value={db} 
        onChange={(e) => handleDbChange(e.target.value)}
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