import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
