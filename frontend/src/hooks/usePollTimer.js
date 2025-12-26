import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePollTimer } from '../store/pollSlice';

export const usePollTimer = (poll) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!poll || poll.status === 'completed') {
      setRemainingTime(0);
      return;
    }

    // Calculate initial remaining time
    const startedAt = new Date(poll.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startedAt) / 1000);
    const initial = Math.max(0, poll.timeLimit - elapsed);
    
    setRemainingTime(initial);

    if (initial <= 0) {
      return;
    }

    // Update timer every second
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - 1);
        dispatch(updatePollTimer(newTime));
        
        if (newTime === 0) {
          clearInterval(interval);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [poll, dispatch]);

  return remainingTime;
};

export default usePollTimer;
