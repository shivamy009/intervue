import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Timer from '../../components/Timer';
import { usePollTimer } from '../../hooks/usePollTimer';
import './TeacherCreatePoll.css';

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
    return null; // Show live dashboard instead
  }

  return (
    <div className="teacher-create-poll">
      <Badge icon="⭐">Intervue Poll</Badge>
      
      <h1 className="create-title">Let's Get Started</h1>
      <p className="create-subtitle">
        you'll have the ability to create and manage polls, ask questions, and monitor
        your students' responses in real-time.
      </p>

      <Card className="create-form">
        <div className="form-header">
          <label className="form-label">Enter your question</label>
          <div className="time-selector">
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="time-dropdown"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>

        <textarea
          className="question-input"
          placeholder="Rahul Bajaj"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
        />
        <div className="char-count">0/{question.length}</div>

        <div className="form-section">
          <h3 className="section-title">Edit Options</h3>
          <h3 className="section-title">Is it Correct?</h3>
        </div>

        {options.map((option, index) => (
          <div key={index} className="option-row">
            <div className="option-input-wrapper">
              <span className="option-number">{index + 1}</span>
              <input
                type="text"
                className="option-input"
                placeholder="Rahul Bajaj"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={!option.isCorrect}
                  onChange={() => {}}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        ))}

        <button className="add-option-btn" onClick={handleAddOption}>
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
