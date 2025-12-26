import React from 'react';
import Badge from '../../components/Badge';

const StudentWaiting = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-gray-50">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <div className="w-20 h-20 border-[6px] border-gray-200 border-t-primary rounded-full animate-spin my-12"></div>
      
      <h2 className="text-2xl font-semibold text-gray-900 text-center">Wait for the teacher to ask questions..</h2>
    </div>
  );
};

export default StudentWaiting;
