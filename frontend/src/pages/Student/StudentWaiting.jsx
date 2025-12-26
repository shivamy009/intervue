import React from 'react';
import Badge from '../../components/Badge';
import './StudentWaiting.css';

const StudentWaiting = () => {
  return (
    <div className="student-waiting">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <div className="spinner"></div>
      
      <h2 className="waiting-text">Wait for the teacher to ask questions..</h2>
    </div>
  );
};

export default StudentWaiting;
