import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import TeacherCreatePoll from './TeacherCreatePoll';
import TeacherDashboard from './TeacherDashboard';
import './Teacher.css';

const Teacher = () => {
  const socket = useSocket('teacher');
  const { activePoll } = useSelector((state) => state.poll);

  useEffect(() => {
    if (socket) {
      socket.emit('teacher:join');
    }
  }, [socket]);

  if (!socket) {
    return <div className="loading">Connecting...</div>;
  }

  return (
    <div className="teacher">
      {!activePoll || activePoll.status !== 'active' ? (
        <TeacherCreatePoll socket={socket} />
      ) : (
        <TeacherDashboard socket={socket} />
      )}
    </div>
  );
};

export default Teacher;
