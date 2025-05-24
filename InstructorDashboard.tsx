import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Users, DollarSign, BarChart2, TrendingUp, TrendingDown, Calendar, Edit, Trash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CoursesContext';
import { useNotification } from '../contexts/NotificationContext';
import { Course } from '../types';

const InstructorDashboard: React.FC = () => {
  const { currentUser, isInstructor } = useAuth();
  const { fetchCourses } = useCourses();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not an instructor
    if (!isInstructor) {
      addNotification('warning', 'You need instructor privileges to access this page');
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      try {
        const allCourses = await fetchCourses();
        
        // Filter for courses by this instructor
        const instructorCourses = allCourses.filter(
          course => course.instructorId === currentUser?.id
        );
        
        setMyCourses(instructorCourses);
      } catch (error) {
        console.error('Error loading instructor courses:', error);
        addNotification('error', 'Failed to load your courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, isInstructor, fetchCourses, addNotification, navigate]);
  
  const stats = [
    { 
      label: 'Total Students', 
      value: myCourses.reduce((sum, course) => sum + course.enrolled, 0),
      icon: <Users className="h-8 w-8 text-blue-600" />,
      change: '+15%',
      trend: 'up'
    },
    { 
      label: 'Total Courses', 
      value: myCourses.length,
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      change: '+1',
      trend: 'up'
    },
    { 
      label: 'Revenue', 
      value: `$${myCourses.reduce((sum, course) => sum + (course.price * course.enrolled), 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      change: '+22%',
      trend: 'up'
    },
    { 
      label: 'Avg. Rating', 
      value: myCourses.length > 0
        ? (myCourses.reduce((sum, course) => sum + course.rating, 0) / myCourses.length).toFixed(1)
        : 'N/A',
      icon: <BarChart2 className="h-8 w-8 text-yellow-600" />,
      change: '+0.2',
      trend: 'up'
    }
  ];
  
  const recentActivity = [
    { 
      type: 'enrollment', 
      message: 'New student enrolled in Introduction to Web Development', 
      time: '2 hours ago' 
    },
    { 
      type: 'review', 
      message: 'New 5-star review on Data Science Fundamentals', 
      time: '1 day ago' 
    },
    { 
      type: 'question', 
      message: 'New question in lesson 3 of Mobile App Development', 
      time: '2 days ago' 
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your courses and track your performance</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              onClick={() => navigate('/instructor/courses/create')}
            >
              <Plus className="h-5 w-5 mr-1" />
              Create New Course
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-sm font-medium">{stat.change}</span>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 ml-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 ml-1" />
                )}
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-800">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Courses */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : myCourses.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {myCourses.map(course => (
                  <div key={course.id} className="p-6 flex flex-col md:flex-row md:items-center">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full md:w-20 h-20 rounded-lg object-cover mb-4 md:mb-0 md:mr-4"
                    />
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800 mb-1">{course.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                          {course.level}
                        </span>
                        {course.categories?.map((category, index) => (
                          <span key={index} className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.enrolled} students</span>
                        <span className="mx-2">•</span>
                        <span>${course.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex mt-4 md:mt-0 space-x-3">
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Start creating your first course and share your knowledge</p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => navigate('/instructor/courses/create')}
                >
                  Create Course
                </button>
              </div>
            )}
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
                <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {/* Simplified chart representation */}
                {[40, 55, 45, 60, 75, 65, 80].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm" 
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      {activity.type === 'enrollment' && (
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'review' && (
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <BarChart2 className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                      {activity.type === 'question' && (
                        <div className="p-2 bg-purple-100 rounded-full">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 text-center border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All Activity
              </button>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
                <div className="flex items-center">
                  <button className="p-1 text-gray-600 hover:text-gray-800">
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <span className="mx-2 text-gray-700">April 2025</span>
                  <button className="p-1 text-gray-600 hover:text-gray-800">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-gray-500 text-sm font-medium">
                    {day}
                  </div>
                ))}
                
                {/* Days of month (simplified) */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <div
                    key={day}
                    className={`text-center p-2 text-sm rounded-full ${
                      day === 15
                        ? 'bg-blue-600 text-white'
                        : [3, 12, 19, 26].includes(day)
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Upcoming Events</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New Course Launch</p>
                    <p className="text-xs text-gray-500">April 15, 2025 at 9:00 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Webinar: Advanced Techniques</p>
                    <p className="text-xs text-gray-500">April 22, 2025 at 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">Create New Course</span>
              </button>
              
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium text-gray-800">Schedule Webinar</span>
              </button>
              
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-800">View Earnings Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;