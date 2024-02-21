import React from 'react';
import './swtich-button.scss';

const SwitchButton = ({ isChecked, onChange }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );
};

export default SwitchButton;