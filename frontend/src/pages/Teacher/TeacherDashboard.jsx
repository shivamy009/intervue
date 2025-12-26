import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';
import './TeacherDashboard.css';

const TeacherDashboard = ({ socket }) => {
  const { activePoll, results } = useSelector((state) => state.poll);
  const { students } = useSelector((state) => state.teacher);
  const [activeTab, setActiveTab] = useState('chart');
  const remainingTime = usePollTimer(activePoll);

  if (!activePoll || activePoll.status !== 'active') {
    return null;
  }

  const totalVotes = results?.totalVotes || 0;

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <Button variant="outline" onClick={() => socket.emit('poll:history')}>
          👁️ View Poll history
        </Button>
      </div>

      <div className="dashboard-content">
        <h2 className="section-label">Question</h2>
        
        <Card className="question-card">
          <p className="question-text">{activePoll.question}</p>
        </Card>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'chart' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('chart')}
          >
            Chat
          </button>
          <button
            className={`tab ${activeTab === 'participants' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
        </div>

        {activeTab === 'chart' && results && (
          <div className="results-container">
            {activePoll.options.map((option, index) => {
              const result = results.results?.[index];
              const percentage = result?.percentage || 0;
              
              return (
                <div key={index} className="result-bar-wrapper">
                  <div className="result-bar">
                    <div className="result-info">
                      <span className="result-icon">
                        {String.fromCharCode(9679)}
                      </span>
                      <span className="result-text">{option.text}</span>
                    </div>
                    <span className="result-percentage">{percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'participants' && (
          <Card className="participants-card">
            <div className="participants-header">
              <span className="participants-label">Name</span>
              <span className="participants-label">Action</span>
            </div>
            {students.map((student) => (
              <div key={student.socketId} className="participant-row">
                <span className="participant-name">{student.name}</span>
                <button
                  className="kick-btn"
                  onClick={() => socket.emit('student:kick', { socketId: student.socketId })}
                >
                  Kick out
                </button>
              </div>
            ))}
          </Card>
        )}

        <Button onClick={() => socket.emit('poll:create', {})}>
          + Ask a new question
        </Button>
      </div>

      <div className="chat-button">
        💬
      </div>
    </div>
  );
};

export default TeacherDashboard;
