import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification('warning', 'Please enter both email and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      addNotification('success', 'Login successful! Welcome back.');
      navigate('/');
    } catch (error) {
      addNotification('error', 'Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'instructor') => {
    setIsSubmitting(true);
    
    try {
      if (role === 'student') {
        await login('student@example.com', 'password');
      } else {
        await login('instructor@example.com', 'password');
      }
      
      addNotification('success', `Logged in as ${role === 'student' ? 'Student' : 'Instructor'}`);
      navigate('/');
    } catch (error) {
      addNotification('error', 'Demo login failed. Please try again.');
      console.error('Demo login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleDemoLogin('student')}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Demo Student
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('instructor')}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Demo Instructor
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;