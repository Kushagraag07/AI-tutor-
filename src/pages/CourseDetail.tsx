import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    checkEnrollmentStatus();
  }, [user, id]);

  const checkEnrollmentStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', id)
        .single();

      if (!error && data) {
        setEnrolled(true);
      }
    } catch (err) {
      console.error('Error checking enrollment status:', err);
    }
  };

  const courseData = {
    title: "English Communication Skills",
    description: "Master English communication through interactive lessons, real-world practice, and AI-powered feedback. Perfect for beginners looking to improve their speaking and writing skills.",
    modules: [
      {
        id: 1,
        title: "Introduction to English Communication",
        content: "Basic concepts and importance of effective communication",
        duration: "30 minutes"
      },
      {
        id: 2,
        title: "Grammar Fundamentals",
        content: "Essential grammar rules for clear communication",
        duration: "45 minutes"
      },
      {
        id: 3,
        title: "Vocabulary Building",
        content: "Expanding your English vocabulary",
        duration: "45 minutes"
      },
      {
        id: 4,
        title: "Listening Skills",
        content: "Improving comprehension through active listening",
        duration: "30 minutes"
      }
    ]
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/courses/${id}` } });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            user_id: user.id,
            course_id: id,
            status: 'active'
          }
        ]);

      if (!error) {
        setEnrolled(true);
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
            alt="English Course"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{courseData.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600">6 Hours</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600">12 Modules</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-gray-600">Beginner Level</span>
            </div>
          </div>

          <p className="text-gray-600 mb-8">{courseData.description}</p>

          {!enrolled ? (
            <button
              onClick={handleEnroll}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors mb-8"
            >
              Enroll Now
            </button>
          ) : (
            <button
              onClick={() => navigate('/assessment/english-communication')}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors mb-8"
            >
              Start Learning
            </button>
          )}

          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>
            <div className="space-y-4">
              {courseData.modules.map((module) => (
                <div key={module.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{module.title}</h3>
                    <p className="text-gray-600 mt-1">{module.content}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold mb-6">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Master essential grammar rules</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Build professional vocabulary</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Improve listening comprehension</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Develop confident speaking skills</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;