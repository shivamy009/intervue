import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button', className = '' }) => {
  const baseClasses = 'px-8 py-3 rounded-lg font-medium text-base cursor-pointer transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'text-white hover:-translate-y-0.5 hover:shadow-lg',
    secondary: 'bg-gray-100 border border-gray-300 hover:bg-gray-200',
    outline: 'bg-transparent border-2 hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const getStyle = () => {
    if (variant === 'primary') {
      return { backgroundColor: '#7765DA', boxShadow: disabled ? 'none' : '0 4px 6px -1px rgba(119, 101, 218, 0.3)' };
    }
    if (variant === 'outline') {
      return { borderColor: '#7765DA', color: '#7765DA', backgroundColor: 'transparent' };
    }
    return {};
  };

  const getHoverStyle = () => {
    if (variant === 'primary' && !disabled) {
      return { backgroundColor: '#5767D0' };
    }
    if (variant === 'outline' && !disabled) {
      return { backgroundColor: '#7765DA', color: 'white', borderColor: '#7765DA' };
    }
    return {};
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={getStyle()}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => !disabled && Object.assign(e.target.style, getHoverStyle())}
      onMouseLeave={(e) => !disabled && Object.assign(e.target.style, getStyle())}
    >
      {children}
    </button>
  );
};

export default Button;
