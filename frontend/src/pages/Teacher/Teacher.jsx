import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import TeacherCreatePoll from './TeacherCreatePoll';
import TeacherDashboard from './TeacherDashboard';

const Teacher = () => {
  const socket = useSocket('teacher');
  const { activePoll } = useSelector((state) => state.poll);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Teacher socket connected');
        setIsConnected(true);
        socket.emit('teacher:join');
      };

      const handleDisconnect = () => {
        console.log('Teacher socket disconnected');
        setIsConnected(false);
      };

      if (socket.connected) {
        handleConnect();
      }

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket]);

  if (!isConnected) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-800">Connecting...</div>;
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
