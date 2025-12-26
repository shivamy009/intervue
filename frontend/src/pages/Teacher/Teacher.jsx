import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import TeacherCreatePoll from './TeacherCreatePoll';
import TeacherDashboard from './TeacherDashboard';

const Teacher = () => {
  const socket = useSocket('teacher');
  const { activePoll } = useSelector((state) => state.poll);

  useEffect(() => {
    if (socket) {
      socket.emit('teacher:join');
    }
  }, [socket]);

  if (!socket) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">Connecting...</div>;
  }

  return (
    <div className="min-h-screen">
      {!activePoll || activePoll.status !== 'active' ? (
        <TeacherCreatePoll socket={socket} />
      ) : (
        <TeacherDashboard socket={socket} />
      )}
    </div>
  );
};

export default Teacher;
