import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { setStudentName } from '../../store/studentSlice';
import './StudentNameEntry.css';

const StudentNameEntry = ({ socket, onNameSubmit }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (name.trim()) {
      dispatch(setStudentName(name));
      socket.emit('student:join', { name });
      onNameSubmit();
    }
  };

  return (
    <div className="student-name-entry">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="entry-title">Let's Get Started</h1>
      <p className="entry-subtitle">
        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live
        polls, and see how your responses compare with your classmates
      </p>

      <div className="name-input-container">
        <label className="input-label">Enter your Name</label>
        <input
          type="text"
          className="name-input"
          placeholder="Rahul Bajaj"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <Button onClick={handleSubmit} disabled={!name.trim()}>
        Continue
      </Button>
    </div>
  );
};

export default StudentNameEntry;
