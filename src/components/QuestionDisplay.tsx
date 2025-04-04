// src/components/Assessment/QuestionDisplay.tsx
import React, { useState } from 'react';
import { Question } from '../types/assessment';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  userAnswer?: string | string[];
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  userAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userAnswer as string || null
  );

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className="question-container p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      
      <div className="options-container space-y-3">
        {question.options?.map((option, index) => (
          <div 
            key={index}
            className={`option p-3 border rounded-lg cursor-pointer transition-colors
                      ${selectedOption === option 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'hover:bg-gray-100 border-gray-300'}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;