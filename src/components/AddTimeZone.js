import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa";

const AddTimeZone = ({ onAdd, darkMode }) => {
  const [newTimeZone, setNewTimeZone] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleInputChange = (e) => {
    setNewTimeZone(e.target.value);
  };

  const handleLabelChange = (e) => {
    setNewLabel(e.target.value);
  };

  const handleAddClick = () => {
    onAdd({ name: newTimeZone, label: newLabel, offset: 0, dst: false, lat: 0, lng: 0 });
    setNewTimeZone('');
    setNewLabel('');
  };

  return (
    <div>
      <input
        type="text"
        value={newTimeZone}
        onChange={handleInputChange}
        placeholder="Enter a time zone (e.g. America/New_York)"
      />
      <input
        type="text"
        value={newLabel}
        onChange={handleLabelChange}
        placeholder="Enter a label (e.g. Home)"
      />
      <button className={`AddButton ${darkMode ? 'dark' : ''}`} onClick={handleAddClick}><FaPlus className={darkMode ? 'icon-style-dark' : 'icon-style'}/></button>
    </div>
  );
};

export default AddTimeZone;