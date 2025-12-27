import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { setPoll, setPollResults, completePoll, setPollHistory, clearPoll } from '../store/pollSlice';
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
      transports: ['polling', 'websocket'],
      upgrade: true,
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,
      timeout: 20000
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
      alert(error.message || 'An error occurred');
    });

    // Teacher-specific listeners
    if (role === 'teacher') {
      socket.on('teacher:state', (data) => {
        if (data.activePoll) {
          dispatch(setPoll(data.activePoll));
        } else {
          // No active poll, clear everything
          dispatch(clearPoll());
        }
        if (data.students) {
          dispatch(setStudents(data.students));
        }
      });

      socket.on('poll:created', (data) => {
        dispatch(setPoll(data.poll));
        // Clear previous results when new poll is created
        dispatch(setPollResults(null));
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

      socket.on('poll:cleared', () => {
        dispatch(clearPoll());
      });
    }

    // Student-specific listeners
    if (role === 'student') {
      socket.on('student:registered', (data) => {
        dispatch(setRegistered(true));
      });

      socket.on('poll:question', (data) => {
        console.log('Student received new poll:', data.poll);
        dispatch(setPoll(data.poll));
        dispatch(resetStudent());
        // Clear previous results
        dispatch(setPollResults(null));
      });

      socket.on('vote:submitted', (data) => {
        dispatch(setPollResults(data.results));
      });

      socket.on('student:kicked', () => {
        dispatch(setKicked(true));
      });

      socket.on('poll:cleared', () => {
        dispatch(clearPoll());
        dispatch(resetStudent());
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
