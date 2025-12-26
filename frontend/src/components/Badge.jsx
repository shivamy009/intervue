import React from 'react';
import './Badge.css';

const Badge = ({ children, icon }) => {
  return (
    <div className="badge">
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
