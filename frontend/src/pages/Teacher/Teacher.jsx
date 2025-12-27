import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import TeacherCreatePoll from './TeacherCreatePoll';
import TeacherDashboard from './TeacherDashboard';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Teacher = () => {
  const socket = useSocket('teacher');
  const { activePoll, pollHistory } = useSelector((state) => state.poll);
  const [isConnected, setIsConnected] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Teacher socket connected');
        setIsConnected(true);
        socket.emit('teacher:join');
      };

      const handleDisconnect = () => {
        console.log('Teacher socket disconnected');
        setIsConnected(false);
      };

      if (socket.connected) {
        handleConnect();
      }

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="w-14 h-14 border-4 rounded-full animate-spin mb-6" style={{ borderColor: '#7765DA', borderTopColor: 'transparent' }} />
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#373737' }}>Joining session</h3>
        <p className="text-sm text-center max-w-xs" style={{ color: '#6E6E6E' }}>This may take a moment — establishing connection with the server.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {!activePoll || activePoll.status !== 'active' ? (
          <TeacherCreatePoll socket={socket} onShowHistory={() => setShowHistory(true)} />
        ) : (
          <TeacherDashboard socket={socket} onShowHistory={() => setShowHistory(true)} />
        )}
      </div>

      {/* Poll History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Poll History</h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {pollHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No polls conducted yet</p>
              ) : (
                <div className="space-y-6">
                  {pollHistory.map((poll, pollIndex) => (
                    <Card key={poll._id} className="border-2 border-gray-200">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Question {pollIndex + 1}: {poll.question}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>👥 {poll.totalVotes} votes</span>
                          <span>⏱️ {poll.timeLimit}s</span>
                          <span>📅 {new Date(poll.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {poll.results?.map((result, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-600 text-xl">●</span>
                                <span className="text-base text-gray-900 font-medium">{result.text}</span>
                              </div>
                              <span className="text-base font-semibold text-gray-900">{result.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 transition-all duration-500"
                                style={{ width: `${result.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Teacher;
