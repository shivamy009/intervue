import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ParticipantModal from '../../components/ParticipantModal';

const StudentResults = ({ socket }) => {
  const { results } = useSelector((state) => state.poll);
  const { students } = useSelector((state) => state.teacher);
  const { name } = useSelector((state) => state.student);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen px-5 py-10" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#373737' }}>Question 1</h2>
        </div>
        
        {/* Combined Card with Question and Results */}
        <div 
          className="rounded-2xl border-2 overflow-hidden mb-12"
          style={{ borderColor: '#7765DA', backgroundColor: 'white' }}
        >
          {/* Question Header */}
          <div className="p-5" style={{ backgroundColor: '#6E6E6E' }}>
            <p className="text-white text-base leading-relaxed font-medium">{results.question}</p>
          </div>

          {/* Results */}
          <div className="p-4 flex flex-col gap-3">
            {results.results.map((result, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="flex-1 h-12 rounded-xl overflow-hidden relative"
                  style={{ backgroundColor: '#F2F2F2' }}
                >
                  <div
                    className="h-full transition-all duration-500 rounded-xl flex items-center gap-3 px-3"
                    style={{ 
                      width: `${Math.max(result.percentage, 8)}%`,
                      backgroundColor: '#7765DA'
                    }}
                  >
                    <span 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ backgroundColor: '#5767D0' }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-white text-sm font-medium">{result.text}</span>
                  </div>
                </div>
                <span className="text-base font-semibold w-12 text-right" style={{ color: '#373737' }}>{result.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xl font-bold" style={{ color: '#373737' }}>
          Wait for the teacher to ask a new question..
        </p>
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

export default StudentResults;
