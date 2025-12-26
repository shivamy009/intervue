import React from 'react';

const Badge = ({ children, icon }) => {
  return (
    <div className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium">
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
