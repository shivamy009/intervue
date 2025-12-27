import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import ParticipantModal from '../../components/ParticipantModal';
import { usePollTimer } from '../../hooks/usePollTimer';
import { clearPoll } from '../../store/pollSlice';

const TeacherDashboard = ({ socket, onShowHistory }) => {
  const dispatch = useDispatch();
  const { activePoll, results } = useSelector((state) => state.poll);
  const { students } = useSelector((state) => state.teacher);
  const [activeTab, setActiveTab] = useState('chart');
  const [allAnswered, setAllAnswered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const remainingTime = usePollTimer(activePoll);

  useEffect(() => {
    if (results && students.length > 0) {
      setAllAnswered(results.totalVotes >= students.length);
    }
  }, [results, students]);

  const handleShowHistory = () => {
    socket.emit('poll:history');
    onShowHistory();
  };

  if (!activePoll || activePoll.status !== 'active') {
    return null;
  }

  const totalVotes = results?.totalVotes || 0;

  return (
    <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button variant="outline" onClick={handleShowHistory}>
            👁️ View Poll history
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#373737' }}>Question</h2>
          <Timer remainingTime={remainingTime} />
        </div>
        
        <Card className="mb-8" style={{ backgroundColor: '#6E6E6E', padding: '20px' }}>
          <p className="text-white text-base leading-relaxed font-medium">{activePoll.question}</p>
        </Card>

        <div className="mb-8">
          {totalVotes === 0 && (
            <p className="text-center text-sm mb-6" style={{ color: '#6E6E6E' }}>
              Waiting for students to submit their answers...
            </p>
          )}
          {activePoll.options.map((option, index) => {
            const result = results?.results?.[index];
            const votes = result?.votes || 0;
            const percentage = result?.percentage || 0;
            
            return (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" style={{ color: '#7765DA' }}>●</span>
                    <span className="text-base font-medium" style={{ color: '#373737' }}>{option.text}</span>
                  </div>
                  <span className="text-base font-semibold" style={{ color: '#373737' }}>{percentage}%</span>
                </div>
                <div className="h-10 rounded-lg overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
                  <div
                    className="h-full transition-all duration-500 rounded-lg flex items-center px-3"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: '#7765DA',
                      minWidth: percentage > 0 ? '40px' : '0'
                    }}
                  >
                    {percentage > 0 && <span className="text-white text-sm font-medium">{option.text}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mb-4">
          {!allAnswered && remainingTime > 0 && (
            <p className="text-sm mb-2 text-center" style={{ color: '#6E6E6E' }}>
              ⏳ Waiting for all students to answer...
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={() => {
              dispatch(clearPoll());
              socket.emit('poll:create', {});
            }}
            disabled={!allAnswered && remainingTime > 0}
          >
            + Ask a new question
          </Button>
        </div>
      </div>

      <div 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: '#7765DA', boxShadow: '0 10px 15px -3px rgba(119, 101, 218, 0.3)' }}
        onClick={() => setIsModalOpen(true)}
      >
        💬
      </div>

      <ParticipantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        students={students}
        socket={socket}
        userRole="teacher"
        userName="Teacher"
      />
    </div>
  );
};

export default TeacherDashboard;
