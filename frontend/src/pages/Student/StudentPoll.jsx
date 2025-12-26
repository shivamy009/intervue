import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';
import { setSelectedOption, setVoted } from '../../store/studentSlice';
import './StudentPoll.css';

const StudentPoll = ({ socket }) => {
  const dispatch = useDispatch();
  const { activePoll } = useSelector((state) => state.poll);
  const { selectedOption, hasVoted } = useSelector((state) => state.student);
  const remainingTime = usePollTimer(activePoll);

  const handleOptionSelect = (index) => {
    if (!hasVoted && remainingTime > 0) {
      dispatch(setSelectedOption(index));
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && activePoll) {
      socket.emit('vote:submit', {
        pollId: activePoll._id,
        selectedOption
      });
      dispatch(setVoted(true));
    }
  };

  if (!activePoll) {
    return null;
  }

  return (
    <div className="student-poll">
      <div className="poll-header">
        <h3 className="poll-question-label">Question 1</h3>
        <Timer remainingTime={remainingTime} />
      </div>

      <Card className="poll-question-card">
        <p className="poll-question-text">{activePoll.question}</p>
      </Card>

      <div className="poll-options">
        {activePoll.options.map((option, index) => (
          <Card
            key={index}
            className={`poll-option ${selectedOption === index ? 'card-selected' : ''} ${hasVoted ? 'disabled' : 'card-selectable'}`}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="option-content">
              <span className="option-icon">
                {String.fromCharCode(9679)}
              </span>
              <span className="option-text">{option.text}</span>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedOption === null || hasVoted || remainingTime === 0}
      >
        Submit
      </Button>

      <div className="chat-button">
        💬
      </div>
    </div>
  );
};

export default StudentPoll;
