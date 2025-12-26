import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import StudentNameEntry from './StudentNameEntry';
import StudentWaiting from './StudentWaiting';
import StudentPoll from './StudentPoll';
import StudentResults from './StudentResults';
import StudentKicked from './StudentKicked';

const Student = () => {
  const socket = useSocket('student');
  const { isRegistered, hasVoted, isKicked } = useSelector((state) => state.student);
  const { activePoll, results } = useSelector((state) => state.poll);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Student socket connected');
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log('Student socket disconnected');
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

  if (isKicked) {
    return <StudentKicked />;
  }

  if (!nameSubmitted) {
    return <StudentNameEntry socket={socket} isConnected={isConnected} onNameSubmit={() => setNameSubmitted(true)} />;
  }

  if (!isConnected) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-gray-800">Connecting...</div>;
  }

  if (!activePoll || activePoll.status !== 'active') {
    if (results) {
      return <StudentResults socket={socket} />;
    }
    return <StudentWaiting />;
  }

  if (hasVoted || results) {
    return <StudentResults socket={socket} />;
  }

  return <StudentPoll socket={socket} />;
};

export default Student;
