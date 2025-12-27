import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import ParticipantModal from '../../components/ParticipantModal';
import { usePollTimer } from '../../hooks/usePollTimer';
import { setSelectedOption, setVoted } from '../../store/studentSlice';

const StudentPoll = ({ socket }) => {
  const dispatch = useDispatch();
  const { activePoll } = useSelector((state) => state.poll);
  const { selectedOption, hasVoted, name } = useSelector((state) => state.student);
  const { students } = useSelector((state) => state.teacher);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="flex justify-between items-center max-w-3xl mx-auto mb-6">
        <h3 className="text-xl font-semibold" style={{ color: '#373737' }}>Question 1</h3>
        <Timer remainingTime={remainingTime} />
      </div>

      <Card className="max-w-3xl mx-auto mb-8" style={{ backgroundColor: '#6E6E6E', padding: '20px' }}>
        <p className="text-white text-base leading-relaxed font-medium">{activePoll.question}</p>
      </Card>

      <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-8">
        {activePoll.options.map((option, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-300 border-2 ${
              hasVoted ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'
            }`}
            style={{
              borderColor: selectedOption === index ? '#7765DA' : '#E5E7EB',
              backgroundColor: selectedOption === index ? '#F3F0FF' : 'white'
            }}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl`} style={{ color: selectedOption === index ? '#7765DA' : '#6E6E6E' }}>
                ●
              </span>
              <span className="text-base font-medium" style={{ color: '#373737' }}>{option.text}</span>
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
        userRole="student"
        userName={name}
      />
    </div>
  );
};

export default StudentPoll;
