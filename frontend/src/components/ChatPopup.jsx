import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleChat, addMessage } from '../store/chatSlice';

const ChatPopup = ({ socket, userName, userRole }) => {
  const dispatch = useDispatch();
  const { messages, isOpen, unreadCount } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && isOpen) {
      socket.emit('chat:history');
    }
  }, [socket, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (message.trim() && socket) {
      socket.emit('chat:message', {
        senderName: userName,
        senderRole: userRole,
        message: message.trim()
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110 z-[1000]" onClick={() => dispatch(toggleChat())}>
        💬
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>}
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl shadow-black/15 flex flex-col z-[1000]">
      <div className="flex justify-between items-center p-4 border-b-2 border-gray-200">
        <div className="flex gap-4">
          <button className="bg-transparent border-none text-base font-medium text-primary pb-2 border-b-2 border-primary transition-all duration-300">Chat</button>
          <button className="bg-transparent border-none text-base font-medium text-gray-500 pb-2 border-b-2 border-transparent transition-all duration-300">Participants</button>
        </div>
        <button className="bg-transparent border-none text-xl text-gray-400 cursor-pointer w-8 h-8 flex items-center justify-center rounded transition-all duration-300 hover:bg-gray-100" onClick={() => dispatch(toggleChat())}>
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 max-w-[80%] ${msg.senderRole === userRole && msg.senderName === userName ? 'self-end' : 'self-start'}`}
          >
            <div className="flex gap-2 items-center text-xs">
              <span className="font-semibold text-gray-900">{msg.senderName}</span>
              <span className="text-gray-500">{msg.senderRole === 'teacher' ? 'User 1' : 'User 2'}</span>
            </div>
            <div className={`${msg.senderRole === userRole && msg.senderName === userName ? 'bg-primary' : 'bg-gray-700'} text-white py-2.5 px-3.5 rounded-xl text-sm leading-relaxed`}>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-200">
        <input
          type="text"
          className="flex-1 py-2.5 px-3.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
          placeholder="Hey There, how can I help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="w-10 h-10 bg-primary text-white border-none rounded-lg cursor-pointer text-lg flex items-center justify-center transition-all duration-300 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={!message.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
