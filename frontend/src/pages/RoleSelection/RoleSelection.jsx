import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === 'teacher') {
      navigate('/teacher');
    } else if (selectedRole === 'student') {
      navigate('/student');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10" style={{ backgroundColor: '#F2F2F2' }}>
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="text-4xl font-bold my-8 text-center" style={{ color: '#373737' }}>
        Welcome to the <span style={{ color: '#7765DA' }}>Live Polling System</span>
      </h1>
      <p className="text-base text-center max-w-2xl mb-12" style={{ color: '#6E6E6E' }}>
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        <Card
          className={`text-left cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
            selectedRole === 'student' ? 'border-[3px]' : 'border-2'
          }`}
          style={{
            borderColor: selectedRole === 'student' ? '#7765DA' : '#E5E7EB',
            backgroundColor: selectedRole === 'student' ? '#F3F0FF' : 'white'
          }}
          onClick={() => setSelectedRole('student')}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#373737' }}>I'm a Student</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6E6E6E' }}>
            Submit answers and view live poll results in real-time. Participate in interactive polls and see how your responses compare with classmates.
          </p>
        </Card>

        <Card
          className={`text-left cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
            selectedRole === 'teacher' ? 'border-[3px]' : 'border-2'
          }`}
          style={{
            borderColor: selectedRole === 'teacher' ? '#7765DA' : '#E5E7EB',
            backgroundColor: selectedRole === 'teacher' ? '#F3F0FF' : 'white'
          }}
          onClick={() => setSelectedRole('teacher')}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: '#373737' }}>I'm a Teacher</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6E6E6E' }}>
            Create and manage polls, ask questions, and monitor student responses in real-time. View analytics and manage participants.
          </p>
        </Card>
      </div>

      <Button onClick={handleContinue} disabled={!selectedRole}>
        Continue
      </Button>
    </div>
  );
};

export default RoleSelection;
