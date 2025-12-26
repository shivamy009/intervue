import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { setStudentName } from '../../store/studentSlice';

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
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-gray-50">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="text-4xl font-bold text-gray-900 my-8 text-center">Let's Get Started</h1>
      <p className="text-base text-gray-500 text-center max-w-2xl mb-12 leading-relaxed">
        If you're a student, you'll be able to <strong className="text-gray-900 font-semibold">submit your answers</strong>, participate in live
        polls, and see how your responses compare with your classmates
      </p>

      <div className="w-full max-w-lg mb-8">
        <label className="block text-base font-semibold text-gray-900 mb-3">Enter your Name</label>
        <input
          type="text"
          className="w-full p-4 border border-gray-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
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
