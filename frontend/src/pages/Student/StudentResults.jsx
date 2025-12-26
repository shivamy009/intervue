import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import './StudentResults.css';

const StudentResults = ({ socket }) => {
  const { results } = useSelector((state) => state.poll);

  if (!results) {
    return null;
  }

  return (
    <div className="student-results">
      <h2 className="results-title">Question 1</h2>
      
      <Card className="results-question-card">
        <p className="results-question-text">{results.question}</p>
      </Card>

      <div className="results-container">
        {results.results.map((result, index) => (
          <div key={index} className="result-bar-wrapper">
            <div className="result-bar">
              <div className="result-info">
                <span className="result-icon">
                  {String.fromCharCode(9679)}
                </span>
                <span className="result-text">{result.text}</span>
              </div>
              <span className="result-percentage">{result.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="results-footer">Wait for the teacher to ask a new question..</p>

      <div className="chat-button">
        💬
      </div>
    </div>
  );
};

export default StudentResults;
