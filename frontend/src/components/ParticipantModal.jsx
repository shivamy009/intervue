import React, { useState } from 'react';
import Card from './Card';

const ParticipantModal = ({ isOpen, onClose, students, socket }) => {
  const [activeTab, setActiveTab] = useState('participants');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-xl font-semibold" style={{ color: '#373737' }}>Communication</h2>
          <button 
            onClick={onClose}
            className="text-2xl leading-none hover:opacity-70 transition-opacity"
            style={{ color: '#6E6E6E' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2" style={{ borderColor: '#E5E7EB' }}>
          <button
            className="flex-1 px-6 py-3 text-base font-medium transition-all duration-300 border-b-2 -mb-0.5"
            style={{
              color: activeTab === 'participants' ? '#7765DA' : '#6E6E6E',
              borderBottomColor: activeTab === 'participants' ? '#7765DA' : 'transparent'
            }}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
          <button
            className="flex-1 px-6 py-3 text-base font-medium transition-all duration-300 border-b-2 -mb-0.5"
            style={{
              color: activeTab === 'chat' ? '#7765DA' : '#6E6E6E',
              borderBottomColor: activeTab === 'chat' ? '#7765DA' : 'transparent'
            }}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {activeTab === 'participants' && (
            <div>
              <div className="grid grid-cols-[1fr_auto] pb-4 border-b mb-4" style={{ borderColor: '#E5E7EB' }}>
                <span className="text-sm font-semibold" style={{ color: '#6E6E6E' }}>Name</span>
                <span className="text-sm font-semibold" style={{ color: '#6E6E6E' }}>Action</span>
              </div>
              {students && students.length > 0 ? (
                students.map((student) => (
                  <div key={student.socketId} className="grid grid-cols-[1fr_auto] py-3 border-b" style={{ borderColor: '#F2F2F2' }}>
                    <span className="text-base" style={{ color: '#373737' }}>{student.name}</span>
                    <button
                      className="bg-transparent border-none text-sm font-medium cursor-pointer hover:underline"
                      style={{ color: '#7765DA' }}
                      onClick={() => socket.emit('student:kick', { socketId: student.socketId })}
                    >
                      Kick out
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-8" style={{ color: '#6E6E6E' }}>No participants yet</p>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="text-center py-12">
              <p style={{ color: '#6E6E6E' }}>Chat feature coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
