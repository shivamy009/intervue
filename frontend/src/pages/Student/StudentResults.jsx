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
      <h2 className="text-xl font-semibold max-w-3xl mx-auto mb-6" style={{ color: '#373737' }}>Question 1</h2>
      
      <Card className="max-w-3xl mx-auto mb-8" style={{ backgroundColor: '#6E6E6E', padding: '20px' }}>
        <p className="text-white text-base leading-relaxed font-medium">{results.question}</p>
      </Card>

      <div className="max-w-3xl mx-auto mb-12">
        {results.results.map((result, index) => (
          <div key={index} className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg" style={{ color: '#7765DA' }}>●</span>
                <span className="text-base font-medium" style={{ color: '#373737' }}>{result.text}</span>
              </div>
              <span className="text-base font-semibold" style={{ color: '#373737' }}>{result.percentage}%</span>
            </div>
            <div className="h-10 rounded-lg overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
              <div
                className="h-full transition-all duration-500 rounded-lg flex items-center px-3"
                style={{ 
                  width: `${result.percentage}%`,
                  backgroundColor: '#7765DA',
                  minWidth: result.percentage > 0 ? '40px' : '0'
                }}
              >
                {result.percentage > 0 && <span className="text-white text-sm font-medium">{result.text}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-lg font-semibold max-w-3xl mx-auto" style={{ color: '#373737' }}>
        Wait for the teacher to ask a new question..
      </p>

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
