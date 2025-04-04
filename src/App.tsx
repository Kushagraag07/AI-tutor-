import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Chatbot from './components/chatbot/Chatbot';

// Assessment button component that uses router hooks correctly
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleAssessmentClick = () => {
    // Replace with your default course ID or add logic to select a course
    navigate('/assessment/default-course-id');
  };
  
  // Hide the button on the assessment page itself
  const hideButton = location.pathname.includes('/assessment/');
  // Add this temporarily to your App.tsx
console.log("API Key:", import.meta.env.VITE_GEMINI_API_KEY ? "Found" : "Not found");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/assessment/:courseId" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
      {/* Chatbot is always visible in the bottom right corner */}
      <Chatbot />
      
      {!hideButton && (
        <button
          onClick={handleAssessmentClick}
          className="fixed bottom-6 left-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full flex items-center shadow-lg transition-colors z-10"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Take Assessment
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;