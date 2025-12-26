import React from 'react';
import Badge from '../../components/Badge';

const StudentKicked = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-gray-50">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="text-4xl font-bold text-gray-900 my-8 text-center">You've been Kicked out !</h1>
      <p className="text-base text-gray-500 text-center max-w-lg leading-relaxed">
        Looks like the teacher had removed you from the poll system. Please
        Try again sometime.
      </p>
    </div>
  );
};

export default StudentKicked;
