import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';

const TeacherCreatePoll = ({ socket, onShowHistory }) => {
  const { activePoll } = useSelector((state) => state.poll);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const remainingTime = usePollTimer(activePoll);

  const handleShowHistory = () => {
    socket.emit('poll:history');
    onShowHistory();
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.trim() && options.every(opt => opt.text.trim())) {
      socket.emit('poll:create', {
        question,
        options,
        timeLimit
      });
      
      // Reset form
      setQuestion('');
      setOptions([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
      ]);
    }
  };

  if (activePoll && activePoll.status === 'active') {
    return null;
  }

  return (
    <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-3xl mx-auto">
        {/* View Poll History Button - positioned at top right */}
        <div className="flex justify-end mb-6">
          <Button variant="outline" onClick={handleShowHistory}>
            👁️ View Poll history
          </Button>
        </div>
        
        <Badge icon="⭐">Intervue Poll</Badge>
        
        <h1 className="text-4xl font-bold my-8" style={{ color: '#373737' }}>Let's Get Started</h1>
        <p className="text-base max-w-2xl mb-12" style={{ color: '#6E6E6E' }}>
          you'll have the ability to create and manage polls, ask questions, and monitor
          your students' responses in real-time.
        </p>

        <Card className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-base font-semibold" style={{ color: '#373737' }}>Enter your question</label>
            <div className="relative inline-flex items-center">
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="appearance-none border py-2 pr-8 pl-3 rounded-md text-sm cursor-pointer"
                style={{ backgroundColor: '#F2F2F2', borderColor: '#E5E7EB', color: '#373737' }}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
              <span className="absolute right-3 pointer-events-none text-xs" style={{ color: '#7765DA' }}>▼</span>
            </div>
          </div>

          <textarea
            className="w-full min-h-[120px] p-4 border rounded-lg text-sm resize-vertical focus:outline-none placeholder:text-gray-400"
            style={{ 
              backgroundColor: '#F2F2F2', 
              borderColor: '#E5E7EB', 
              color: '#373737',
              '--tw-ring-color': '#7765DA'
            }}
            placeholder="What is the capital of France?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={100}
            onFocus={(e) => e.target.style.borderColor = '#7765DA'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
          <div className="text-right text-xs mt-2" style={{ color: '#6E6E6E' }}>{question.length}/100</div>

          <div className="grid grid-cols-[1fr_auto] gap-4 my-8">
            <h3 className="text-base font-semibold" style={{ color: '#373737' }}>Edit Options</h3>
            <h3 className="text-base font-semibold" style={{ color: '#373737' }}>Is it Correct?</h3>
          </div>

          {options.map((option, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto] gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F2F2F2' }}>
                <span 
                  className="flex items-center justify-center w-7 h-7 text-white rounded-full text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: '#7765DA' }}
                >
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                  style={{ color: '#373737' }}
                  placeholder="Enter option text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: '#373737' }}>
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.isCorrect}
                    onChange={() => handleCorrectChange(index)}
                    className="w-[18px] h-[18px] cursor-pointer"
                    style={{ accentColor: '#7765DA' }}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: '#373737' }}>
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={!option.isCorrect}
                    onChange={() => {}}
                    className="w-[18px] h-[18px] cursor-pointer"
                    style={{ accentColor: '#7765DA' }}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}

          <button 
            className="w-full p-3 border-2 border-dashed bg-transparent text-sm font-medium rounded-lg cursor-pointer mt-4 transition-all duration-300"
            style={{ borderColor: '#7765DA', color: '#7765DA' }}
            onClick={handleAddOption}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F0FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            + Add More option
          </button>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!question.trim() || options.some(opt => !opt.text.trim())}>
            Ask Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreatePoll;
