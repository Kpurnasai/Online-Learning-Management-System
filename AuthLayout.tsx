import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center text-2xl font-bold">
            <BookOpen className="h-8 w-8 mr-2" />
            <span>EduLearn</span>
          </div>
          
          <div className="mt-16">
            <h1 className="text-4xl font-bold mb-6">Start your learning journey today</h1>
            <p className="text-lg text-blue-100 mb-8">
              Access a world of knowledge with thousands of courses from expert instructors. Learn at your own pace, anytime, anywhere.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-500 rounded-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Expert-led courses</h3>
                  <p className="text-blue-100">Learn from industry professionals and academics</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-500 rounded-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Interactive learning</h3>
                  <p className="text-blue-100">Engage with quizzes, assignments, and discussions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-blue-500 rounded-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Flexible learning</h3>
                  <p className="text-blue-100">Learn at your own pace on any device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-blue-100">&copy; 2025 EduLearn. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center text-2xl font-bold text-blue-600 mb-8 justify-center">
            <BookOpen className="h-8 w-8 mr-2" />
            <span>EduLearn</span>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;