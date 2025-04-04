import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
          <p className="text-gray-600">Your enrolled courses will appear here</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Progress Overview</h2>
          <p className="text-gray-600">Your learning progress will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;