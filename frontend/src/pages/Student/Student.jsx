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

  // If there's an active poll, show it
  if (activePoll && activePoll.status === 'active') {
    // If student has voted, show results (or loading if results not yet received)
    if (hasVoted) {
      if (!results) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#7765DA', borderTopColor: 'transparent' }}></div>
            <p className="text-lg font-medium" style={{ color: '#373737' }}>Loading results...</p>
          </div>
        );
      }
      return <StudentResults socket={socket} />;
    }
    // Otherwise show poll to vote
    return <StudentPoll socket={socket} />;
  }

  // If poll is completed, show results
  if (results) {
    return <StudentResults socket={socket} />;
  }

  // No active poll - show waiting screen
  return <StudentWaiting />;
};

export default Student;
