import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';

const TeacherCreatePoll = ({ socket }) => {
  const { activePoll } = useSelector((state) => state.poll);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const remainingTime = usePollTimer(activePoll);

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
    <div className="flex flex-col items-center min-h-screen px-5 py-10 bg-gray-50">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="text-4xl font-bold text-gray-900 my-8 text-center">Let's Get Started</h1>
      <p className="text-base text-gray-500 text-center max-w-2xl mb-12">
        you'll have the ability to create and manage polls, ask questions, and monitor
        your students' responses in real-time.
      </p>

      <Card className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-base font-semibold text-gray-900">Enter your question</label>
          <div className="relative inline-flex items-center">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="appearance-none bg-gray-100 border border-gray-200 py-2 pr-8 pl-3 rounded-md text-sm cursor-pointer"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-primary text-xs">▼</span>
          </div>
        </div>

        <textarea
          className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg text-sm resize-vertical bg-gray-50 focus:outline-none focus:border-primary"
          placeholder="Rahul Bajaj"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
        />
        <div className="text-right text-xs text-gray-400 mt-2">0/{question.length}</div>

        <div className="grid grid-cols-[1fr_auto] gap-4 my-8">
          <h3 className="text-base font-semibold text-gray-900">Edit Options</h3>
          <h3 className="text-base font-semibold text-gray-900">Is it Correct?</h3>
        </div>

        {options.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] gap-4 mb-4">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-sm font-semibold flex-shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                className="flex-1 border-none bg-transparent text-sm outline-none"
                placeholder="Rahul Bajaj"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  className="w-[18px] h-[18px] cursor-pointer accent-primary"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={!option.isCorrect}
                  onChange={() => {}}
                  className="w-[18px] h-[18px] cursor-pointer accent-primary"
                />
                <span>No</span>
              </label>
            </div>
          </div>
        ))}

        <button 
          className="w-full p-3 border-2 border-dashed border-primary bg-transparent text-primary text-sm font-medium rounded-lg cursor-pointer mt-4 transition-all duration-300 hover:bg-indigo-50"
          onClick={handleAddOption}
        >
          + Add More option
        </button>
      </Card>

      <Button onClick={handleSubmit} disabled={!question.trim() || options.some(opt => !opt.text.trim())}>
        Ask Question
      </Button>
    </div>
  );
};

export default TeacherCreatePoll;
