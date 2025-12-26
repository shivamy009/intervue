import React from 'react';
import Badge from '../../components/Badge';
import './StudentKicked.css';

const StudentKicked = () => {
  return (
    <div className="student-kicked">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="kicked-title">You've been Kicked out !</h1>
      <p className="kicked-message">
        Looks like the teacher had removed you from the poll system. Please
        Try again sometime.
      </p>
    </div>
  );
};

export default StudentKicked;
