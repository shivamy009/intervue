import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';
import { setSelectedOption, setVoted } from '../../store/studentSlice';

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
    <div className="min-h-screen px-5 py-10 bg-gray-50">
      <div className="flex justify-between items-center max-w-3xl mx-auto mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Question 1</h3>
        <Timer remainingTime={remainingTime} />
      </div>

      <Card className="max-w-3xl mx-auto mb-8 bg-gray-700">
        <p className="text-white text-base leading-relaxed">{activePoll.question}</p>
      </Card>

      <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-8">
        {activePoll.options.map((option, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedOption === index 
                ? 'border-primary bg-indigo-50' 
                : 'border-gray-200'
            } ${hasVoted ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary hover:-translate-y-0.5'}`}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl ${selectedOption === index ? 'text-primary' : 'text-gray-400'}`}>
                ●
              </span>
              <span className="text-base text-gray-700 font-medium">{option.text}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null || hasVoted || remainingTime === 0}
        >
          Submit
        </Button>
      </div>

      <div className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110">
        💬
      </div>
    </div>
  );
};

export default StudentPoll;
