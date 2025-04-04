// src/pages/LearningPathPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLearningPathForStudent } from '../services/learningPathService';
import { LearningPath, LearningModule } from '../types/assessment';

const LearningPathPage: React.FC = () => {
  const { courseId, level } = useParams<{ courseId: string; level: string }>();
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLearningPath = async () => {
      if (!courseId || !level) {
        setError('Missing course ID or level');
        setIsLoading(false);
        return;
      }
      
      try {
        // In a real app, you'd get the concept scores from the user's assessment results
        const mockConceptScores = {
          variables: 75,
          functions: 60,
          loops: 85,
          arrays: 70
        };
        
        const path = await getLearningPathForStudent(
          courseId,
          level as 'beginner' | 'intermediate' | 'advanced',
          mockConceptScores
        );
        
        setLearningPath(path);
      } catch (err) {
        setError('Failed to load learning path');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLearningPath();
  }, [courseId, level]);
  
  if (isLoading) {
    return <div className="text-center py-12">Loading your learning path...</div>;
  }
  
  if (error || !learningPath) {
    return <div className="text-center py-12 text-red-500">{error || 'No learning path found'}</div>;
  }
  
  return (
    <div className="learning-path-page container mx-auto py-8 px-4">
      <div className="header mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Learning Path</h1>
        <p className="text-lg text-gray-700">
          Level: <span className="font-medium capitalize">{learningPath.level}</span>
        </p>
        <p className="mt-2">{learningPath.description}</p>
      </div>
      
      <div className="modules-container">
        <h2 className="text-2xl font-semibold mb-4">Your Course Modules</h2>
        
        <div className="space-y-4">
          {learningPath.modules.map((module, index) => (
            <div 
              key={module.id}
              className="module-card p-5 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">
                    {index + 1}. {module.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{module.description}</p>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      ⏱️ {module.estimatedTimeMinutes} minutes
                    </span>
                    <span className="capitalize">
                      {module.difficulty}
                    </span>
                  </div>
                </div>
                
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathPage;