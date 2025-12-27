import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

const ParticipantModal = ({ isOpen, onClose, students, socket, userRole, userName }) => {
  const [activeTab, setActiveTab] = useState('participants');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    const handleChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('chat:message', handleChatMessage);

    return () => {
      socket.off('chat:message', handleChatMessage);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      senderName: userName || (userRole === 'teacher' ? 'Teacher' : 'Anonymous'),
      senderRole: userRole,
      message: newMessage.trim()
    };

    socket.emit('chat:message', messageData);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Modal positioned at bottom-right */}
      <div 
        className="pointer-events-auto absolute bottom-24 right-8 bg-white rounded-xl shadow-2xl transition-all duration-300"
        style={{ 
          width: '400px', 
          height: '600px',
          maxHeight: 'calc(100vh - 140px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#373737' }}>Communication</h2>
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
            className="flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 -mb-0.5"
            style={{
              color: activeTab === 'participants' ? '#7765DA' : '#6E6E6E',
              borderBottomColor: activeTab === 'participants' ? '#7765DA' : 'transparent'
            }}
            onClick={() => setActiveTab('participants')}
          >
            Participants
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 border-b-2 -mb-0.5"
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
        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
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
            <div className="flex flex-col" style={{ height: 'calc(100% - 60px)' }}>
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: '#6E6E6E' }}>No messages yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-semibold" style={{ color: '#373737' }}>
                            {msg.senderName}
                          </span>
                          <span className="text-xs" style={{ color: '#6E6E6E' }}>
                            {msg.senderRole === 'teacher' ? '(Teacher)' : '(Student)'}
                          </span>
                        </div>
                        <div 
                          className="px-3 py-2 rounded-lg inline-block max-w-full break-words"
                          style={{ 
                            backgroundColor: msg.senderRole === 'teacher' ? '#7765DA' : '#F2F2F2',
                            color: msg.senderRole === 'teacher' ? 'white' : '#373737'
                          }}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="border-t pt-3" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
                    style={{ 
                      borderColor: '#E5E7EB',
                      color: '#373737'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#7765DA'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#7765DA' }}
                    onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#5767D0')}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#7765DA'}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
