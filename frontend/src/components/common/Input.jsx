import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, name, className = '', ...props }) => {
  // Use a single, simple class name from your App.css file
  const inputClass = `form-input ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={inputClass}
      {...props}
    />
  );
};

export default Input;