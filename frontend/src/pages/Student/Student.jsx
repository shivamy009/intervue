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

  if (isKicked) {
    return <StudentKicked />;
  }

  if (!nameSubmitted) {
    return <StudentNameEntry socket={socket} onNameSubmit={() => setNameSubmitted(true)} />;
  }

  if (!socket) {
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
