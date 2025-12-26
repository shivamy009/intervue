import React from 'react';

const Badge = ({ children, icon }) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#7765DA', color: 'white' }}>
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
