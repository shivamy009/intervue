import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';

const StudentResults = ({ socket }) => {
  const { results } = useSelector((state) => state.poll);

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen px-5 py-10 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-900 max-w-3xl mx-auto mb-6">Question 1</h2>
      
      <Card className="max-w-3xl mx-auto mb-8 bg-gray-800">
        <p className="text-white text-base leading-relaxed font-medium">{results.question}</p>
      </Card>

      <div className="max-w-3xl mx-auto mb-12">
        {results.results.map((result, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-xl">●</span>
                <span className="text-base text-gray-900 font-medium">{result.text}</span>
              </div>
              <span className="text-base font-semibold text-gray-900">{result.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-lg font-semibold text-gray-900 max-w-3xl mx-auto">
        Wait for the teacher to ask a new question..
      </p>

      <div className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-lg shadow-indigo-600/30 transition-transform duration-300 hover:scale-110">
        💬
      </div>
    </div>
  );
};

export default StudentResults;
