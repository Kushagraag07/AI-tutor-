// src/components/Assessment/ResultsDisplay.tsx
import React from 'react';
import { AssessmentResult } from '../types/assessment';

interface ResultsDisplayProps {
  result: AssessmentResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="results-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Assessment Results</h2>
      
      <div className="score-overview mb-6">
        <div className="text-5xl font-bold text-center mb-2">
          {Math.round(result.score)}%
        </div>
        <div className="text-xl text-center">
          Level: <span className="font-semibold capitalize">{result.level}</span>
        </div>
      </div>
      
      <div className="concept-breakdown">
        <h3 className="text-xl font-semibold mb-3">Concept Breakdown</h3>
        
        <div className="space-y-3">
          {Object.entries(result.conceptScores).map(([concept, score]) => (
            <div key={concept} className="concept-item">
              <div className="flex justify-between mb-1">
                <span className="capitalize">{concept.replace('_', ' ')}</span>
                <span>{Math.round(score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="recommendation mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
        <p>
          Based on your assessment, we recommend the {result.level} learning path.
          This path is tailored to your current knowledge level and will help you
          improve in the concepts where you need more practice.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;