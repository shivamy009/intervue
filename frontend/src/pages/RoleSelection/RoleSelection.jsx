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
    <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-gray-50">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="text-4xl font-bold text-gray-900 my-8 text-center">
        Welcome to the <span className="text-primary">Live Polling System</span>
      </h1>
      <p className="text-base text-gray-500 text-center max-w-2xl mb-12">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        <Card
          className={`text-left cursor-pointer border-2 ${selectedRole === 'student' ? 'border-primary bg-indigo-50' : 'border-gray-200'} hover:border-primary hover:-translate-y-0.5`}
          onClick={() => setSelectedRole('student')}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-3">I'm a Student</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </Card>

        <Card
          className={`text-left cursor-pointer border-2 ${selectedRole === 'teacher' ? 'border-primary bg-indigo-50' : 'border-gray-200'} hover:border-primary hover:-translate-y-0.5`}
          onClick={() => setSelectedRole('teacher')}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-3">I'm a Teacher</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Submit answers and view live poll results in real-time.
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
