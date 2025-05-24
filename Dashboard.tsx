import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Clock, Trophy, PlayCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CoursesContext';
import { useNotification } from '../contexts/NotificationContext';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { fetchCourses } = useCourses();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCourses = await fetchCourses();
        
        // For demo purposes, we'll just pretend the user is enrolled in the first course
        const enrolled = allCourses.slice(0, 1);
        enrolled[0].progress = 25; // Add progress for demo
        
        // Set recommended courses (all other courses)
        const recommended = allCourses.slice(1);
        
        setMyCourses(enrolled);
        setRecommendedCourses(recommended);
        
        // Demo notification
        setTimeout(() => {
          addNotification('info', 'Welcome back! You have a new lesson available in your Web Development course.', 8000);
        }, 1500);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        addNotification('error', 'Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchCourses, addNotification]);

  const stats = [
    { icon: <BookOpen className="h-6 w-6 text-blue-600" />, label: 'Courses Enrolled', value: myCourses.length },
    { icon: <Clock className="h-6 w-6 text-green-600" />, label: 'Hours Learned', value: '12.5' },
    { icon: <Trophy className="h-6 w-6 text-yellow-600" />, label: 'Certificates', value: '1' },
    { icon: <BarChart2 className="h-6 w-6 text-purple-600" />, label: 'Progress', value: '68%' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow aspect-video"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {currentUser?.name || 'Student'}!</h1>
        <p className="text-gray-600 mt-2">Continue your learning journey with these courses and resources.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            onClick={() => navigate('/courses')}
          >
            View All Courses
          </button>
        </div>

        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in your first course</p>
            <button 
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>

      {/* Last Lesson */}
      {myCourses.length > 0 && myCourses[0].lessons && myCourses[0].lessons.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Pick Up Where You Left Off</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gray-100 aspect-video md:aspect-auto flex items-center justify-center p-8">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={myCourses[0].thumbnail} 
                    alt={myCourses[0].title} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Lesson {myCourses[0].lessons[0].order}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {myCourses[0].lessons[0].duration} minutes
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{myCourses[0].lessons[0].title}</h3>
                <p className="text-gray-600 mb-6">{myCourses[0].lessons[0].description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button 
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    onClick={() => navigate(`/courses/${myCourses[0].id}/lessons/${myCourses[0].lessons[0].id}`)}
                  >
                    Continue Lesson
                  </button>
                  
                  <button 
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                    onClick={() => navigate(`/courses/${myCourses[0].id}`)}
                  >
                    Course Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recommended For You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.slice(0, 3).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;