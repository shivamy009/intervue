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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button variant="outline" onClick={handleShowHistory}>
            👁️ View Poll history
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#373737' }}>Question</h2>
          <Timer remainingTime={remainingTime} />
        </div>
        
        {/* Combined Card with Question and Results */}
        <div 
          className="rounded-2xl border-2 overflow-hidden mb-8"
          style={{ borderColor: '#7765DA', backgroundColor: 'white' }}
        >
          {/* Question Header */}
          <div className="p-5" style={{ backgroundColor: '#6E6E6E' }}>
            <p className="text-white text-base leading-relaxed font-medium">{activePoll.question}</p>
          </div>

          {/* Results */}
          <div className="p-4 flex flex-col gap-3">
            {totalVotes === 0 && (
              <p className="text-center text-sm py-4" style={{ color: '#6E6E6E' }}>
                Waiting for students to submit their answers...
              </p>
            )}
            {activePoll.options.map((option, index) => {
              const result = results?.results?.[index];
              const votes = result?.votes || 0;
              const percentage = result?.percentage || 0;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="flex-1 h-12 rounded-xl overflow-hidden relative"
                    style={{ backgroundColor: '#F2F2F2' }}
                  >
                    {/* Background with text always visible */}
                    <div className="absolute inset-0 flex items-center gap-3 px-3 z-10">
                      <span 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: '#7765DA' }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#373737' }}>{option.text}</span>
                    </div>
                    {/* Purple fill overlay */}
                    <div
                      className="h-full transition-all duration-500 rounded-xl"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: '#7765DA'
                      }}
                    />
                  </div>
                  <span className="text-base font-semibold w-12 text-right" style={{ color: '#373737' }}>{percentage}%</span>
                </div>
              );
            })}
          </div>
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
