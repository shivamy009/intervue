import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import './RoleSelection.css';

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
    <div className="role-selection">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="role-title">
        Welcome to the <span className="highlight">Live Polling System</span>
      </h1>
      <p className="role-subtitle">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="role-cards">
        <Card
          className={`role-card card-selectable ${selectedRole === 'student' ? 'card-selected' : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <h2 className="role-card-title">I'm a Student</h2>
          <p className="role-card-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </Card>

        <Card
          className={`role-card card-selectable ${selectedRole === 'teacher' ? 'card-selected' : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <h2 className="role-card-title">I'm a Teacher</h2>
          <p className="role-card-description">
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
