// src/pages/AssessmentPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentEngine from '../components/AssessmentEngine';
import { AssessmentResult } from '../types/assessment';
import { supabase } from 'D:/intel/project/project/src/lib/supabase';

const AssessmentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, you'd get this from auth context
  const userId = '123'; // Placeholder
  
  const handleAssessmentComplete = async (result: AssessmentResult) => {
    setIsLoading(true);
    
    // In a real app, you'd save this to the user's profile
    console.log('Assessment completed with result:', result);
    
    // Navigate to the appropriate learning path
    navigate(`/courses/${courseId}/path/${result.level}`);
  };
  
  if (!courseId) {
    return <div>Invalid course ID</div>;
  }
  
  return (
    <div className="assessment-page container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Course Assessment</h1>
      
      <div className="mb-6">
        <p className="text-lg">
          This assessment will help us determine your current knowledge level
          and create a personalized learning path for you.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-xl">Analyzing your results...</p>
          <p className="mt-2 text-gray-600">
            We're preparing your personalized learning path.
          </p>
        </div>
      ) : (
        <AssessmentEngine
          courseId={courseId}
          userId={userId}
          onComplete={handleAssessmentComplete}
        />
      )}
    </div>
  );
};

export default AssessmentPage;