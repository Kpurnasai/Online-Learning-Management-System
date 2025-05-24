import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CoursesProvider } from './contexts/CoursesContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import CoursesList from './pages/CoursesList';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseCreator from './pages/CourseCreator';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CoursesProvider>
          <NotificationProvider>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Main app routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
                <Route path="/courses/:courseId/quizzes/:quizId" element={<Quiz />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                <Route path="/instructor/courses/create" element={<CourseCreator />} />
                <Route path="/instructor/courses/:courseId/edit" element={<CourseCreator />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </CoursesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;