import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { setPoll, setPollResults, completePoll, setPollHistory } from '../store/pollSlice';
import { setStudents } from '../store/teacherSlice';
import { setRegistered, setKicked, resetStudent } from '../store/studentSlice';
import { addMessage, setMessages } from '../store/chatSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const useSocket = (role) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const socket = newSocket;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Teacher-specific listeners
    if (role === 'teacher') {
      socket.on('teacher:state', (data) => {
        if (data.activePoll) {
          dispatch(setPoll(data.activePoll));
        }
        if (data.students) {
          dispatch(setStudents(data.students));
        }
      });

      socket.on('poll:created', (data) => {
        dispatch(setPoll(data.poll));
      });

      socket.on('students:updated', (students) => {
        dispatch(setStudents(students));
      });

      socket.on('poll:results', (results) => {
        dispatch(setPollResults(results));
      });

      socket.on('poll:history', (polls) => {
        dispatch(setPollHistory(polls));
      });
    }

    // Student-specific listeners
    if (role === 'student') {
      socket.on('student:registered', (data) => {
        dispatch(setRegistered(true));
      });

      socket.on('poll:question', (data) => {
        dispatch(setPoll(data.poll));
        dispatch(resetStudent());
      });

      socket.on('vote:submitted', (data) => {
        dispatch(setPollResults(data.results));
      });

      socket.on('student:kicked', () => {
        dispatch(setKicked(true));
      });
    }

    // Common listeners
    socket.on('poll:completed', (results) => {
      dispatch(completePoll(results));
    });

    socket.on('chat:message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('chat:history', (messages) => {
      dispatch(setMessages(messages));
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socket;
};

export default useSocket;
