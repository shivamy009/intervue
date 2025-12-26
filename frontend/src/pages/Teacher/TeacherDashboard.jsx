import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';
import { clearPoll } from '../../store/pollSlice';

const TeacherDashboard = ({ socket }) => {
  const dispatch = useDispatch();
  const { activePoll, results } = useSelector((state) => state.poll);
  const { students } = useSelector((state) => state.teacher);
  const [activeTab, setActiveTab] = useState('chart');
  const remainingTime = usePollTimer(activePoll);

  if (!activePoll || activePoll.status !== 'active') {
    return null;
  }

  const totalVotes = results?.totalVotes || 0;

  return (
    <div className="min-h-screen px-5 py-10 bg-gray-50">
      <div className="flex justify-end max-w-3xl mx-auto mb-8">
        <Button variant="outline" onClick={() => socket.emit('poll:history')}>
          👁️ View Poll history
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Question</h2>
        
        <Card className="mb-8 bg-gray-800">
          <p className="text-white text-base leading-relaxed font-medium">{activePoll.question}</p>
        </Card>

        <div className="flex gap-0.5 mb-6 border-b-2 border-gray-200">
          <button
            className={`px-6 py-3 bg-transparent border-none text-base font-medium transition-all duration-300 border-b-2 -mb-0.5 ${
              activeTab === 'chart' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-gray-500 border-transparent'
            }`}
            onClick={() => setActiveTab('chart')}
          >
            Chat
          </button>
          <button
            className={`px-6 py-3 bg-transparent border-none text-base font-medium transition-all duration-300 border-b-2 -mb-0.5 ${
              activeTab === 'participants' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-gray-500 border-transparent'
            }`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
        </div>

        {activeTab === 'chart' && results && (
          <div className="mb-8">
            {activePoll.options.map((option, index) => {
              const result = results.results?.[index];
              const percentage = result?.percentage || 0;
              
              return (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600 text-xl">●</span>
                      <span className="text-base text-gray-900 font-medium">{option.text}</span>
                    </div>
                    <span className="text-base font-semibold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'participants' && (
          <Card className="mb-8">
            <div className="grid grid-cols-[1fr_auto] pb-4 border-b border-gray-200 mb-4">
              <span className="text-sm font-semibold text-gray-500">Name</span>
              <span className="text-sm font-semibold text-gray-500">Action</span>
            </div>
            {students.map((student) => (
              <div key={student.socketId} className="grid grid-cols-[1fr_auto] py-3 border-b border-gray-100">
                <span className="text-base text-gray-900">{student.name}</span>
                <button
                  className="bg-transparent border-none text-indigo-600 text-sm font-medium cursor-pointer hover:underline"
                  onClick={() => socket.emit('student:kick', { socketId: student.socketId })}
                >
                  Kick out
                </button>
              </div>
            ))}
          </Card>
        )}

        <Button onClick={() => {
          dispatch(clearPoll());
          socket.emit('poll:create', {});
        }}>
          + Ask a new question
        </Button>
      </div>

      <div className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg shadow-indigo-600/30 transition-transform duration-300 hover:scale-110">
        💬
      </div>
    </div>
  );
};

export default TeacherDashboard;
