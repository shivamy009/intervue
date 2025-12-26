import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleChat, addMessage } from '../store/chatSlice';
import './ChatPopup.css';

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
      <div className="chat-button" onClick={() => dispatch(toggleChat())}>
        💬
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>
    );
  }

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <div className="chat-tabs">
          <button className="chat-tab chat-tab-active">Chat</button>
          <button className="chat-tab">Participants</button>
        </div>
        <button className="chat-close" onClick={() => dispatch(toggleChat())}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.senderRole === userRole && msg.senderName === userName ? 'chat-message-own' : ''}`}
          >
            <div className="message-header">
              <span className="message-sender">{msg.senderName}</span>
              <span className="message-role">{msg.senderRole === 'teacher' ? 'User 1' : 'User 2'}</span>
            </div>
            <div className="message-text">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Hey There, how can I help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send" onClick={handleSend} disabled={!message.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
