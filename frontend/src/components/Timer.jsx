import React from 'react';

const Timer = ({ remainingTime }) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const isLowTime = remainingTime <= 10;

  return (
    <div className={`flex items-center gap-2 font-semibold text-lg ${isLowTime ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <polyline points="12 6 12 12 16 14" strokeWidth="2"/>
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
