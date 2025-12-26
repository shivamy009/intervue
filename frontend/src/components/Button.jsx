import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button', className = '' }) => {
  const baseClasses = 'px-8 py-3 rounded-lg font-medium text-base cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
