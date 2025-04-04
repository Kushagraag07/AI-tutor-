import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCourses(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
              alt="English Course"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Beginner
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">English Communication Skills</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Master English communication through interactive lessons, real-world practice, and AI-powered feedback. Perfect for beginners looking to improve their speaking and writing skills.
            </p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <GraduationCap className="h-4 w-4 mr-1" />
                <span>12 Modules</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>6 Hours</span>
              </div>
            </div>
            <Link
              to="/courses/english-communication"
              className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;