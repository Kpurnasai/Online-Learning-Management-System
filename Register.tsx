import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      addNotification('warning', 'Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      addNotification('warning', 'Password must be at least 6 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password, role);
      addNotification('success', 'Registration successful! Welcome to EduLearn.');
      navigate('/');
    } catch (error) {
      addNotification('error', 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
        <p className="text-gray-600 mt-2">Join thousands of learners from around the world</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
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
            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${
                  role === 'student'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setRole('student')}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 font-medium text-gray-700">Learn</span>
              </div>
              
              <div
                className={`border rounded-lg p-4 flex items-center cursor-pointer transition-colors ${
                  role === 'instructor'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setRole('instructor')}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === 'instructor'}
                  onChange={() => setRole('instructor')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 font-medium text-gray-700">Teach</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating account...' : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;