// In your src/pages/Home.tsx file, add or modify:

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react'; // Using lucide-react which is already in your dependencies

const Home: React.FC = () => {
  const navigate = useNavigate();

  // This function will handle navigation to the assessment page
  const handleAssessmentClick = () => {
    // You'll need to provide a courseId here
    // For now I'll use a placeholder, but you should replace this with
    // either a default course ID or a way to select a course
    navigate('/assessment/default-course-id');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Tutor Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Personalized learning paths tailored to your needs</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {/* Your existing buttons/actions might be here */}
          
          {/* New Assignment Button */}
          <button
            onClick={handleAssessmentClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Take Assessment
          </button>
        </div>
      </div>
      
      {/* Rest of your Home page content... */}
    </div>
  );
};

export default Home;