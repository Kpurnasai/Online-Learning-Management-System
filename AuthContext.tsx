import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isInstructor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'student@example.com', password: 'password', role: 'student', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Jane Smith', email: 'instructor@example.com', password: 'password', role: 'instructor', avatar: 'https://i.pravatar.cc/150?img=5' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('lmsUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('lmsUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'instructor') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('lmsUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lmsUser');
  };

  const isAuthenticated = currentUser !== null;
  const isInstructor = currentUser?.role === 'instructor';

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isInstructor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};