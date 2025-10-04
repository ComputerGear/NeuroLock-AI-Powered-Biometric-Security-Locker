import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  // Determine the class based on the variant prop
  const buttonClass = `btn ${variant === 'secondary' ? 'btn-secondary' : ''} ${className}`;

  return (
    <button type={type} onClick={onClick} className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;