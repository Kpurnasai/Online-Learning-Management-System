import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Play, CheckCircle, Calendar, Award, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Course } from '../types';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { fetchCourseById, enrollInCourse } = useCourses();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor'>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [enrolling, setEnrolling] = useState(false);
  
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await fetchCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
          
          // Initialize all curriculum sections as expanded
          if (courseData.lessons) {
            const sections: Record<string, boolean> = {};
            courseData.lessons.forEach(lesson => {
              sections[lesson.id] = true;
            });
            setExpandedSections(sections);
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
        addNotification('error', 'Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, fetchCourseById, addNotification]);
  
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      addNotification('warning', 'Please sign in to enroll in this course');
      navigate('/login');
      return;
    }
    
    if (!course) return;
    
    setEnrolling(true);
    try {
      await enrollInCourse(course.id);
      addNotification('success', `Successfully enrolled in ${course.title}!`);
      navigate(`/courses/${course.id}/lessons/${course.lessons[0]?.id || '1'}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      addNotification('error', 'Failed to enroll in course. Please try again later.');
    } finally {
      setEnrolling(false);
    }
  };
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const calculateTotalDuration = () => {
    if (!course?.lessons || course.lessons.length === 0) {
      return '0 hours';
    }
    
    const totalMinutes = course.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm h-96"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Course Header */}
      <div className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {course.categories?.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-500 bg-opacity-30 rounded-full text-xs font-medium">
                    {category}
                  </span>
                ))}
                <span className="px-2 py-1 bg-blue-500 bg-opacity-30 rounded-full text-xs font-medium">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 mb-4">{course.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center text-blue-100 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{course.rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-1" />
              <span>{course.enrolled.toLocaleString()} Students</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{calculateTotalDuration()}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Last updated: April 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'curriculum'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Curriculum
                </button>
                <button
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'instructor'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('instructor')}
                >
                  Instructor
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {['Master the fundamentals of web development', 
                    'Build responsive websites with HTML and CSS', 
                    'Create interactive features with JavaScript', 
                    'Understand modern web development workflows', 
                    'Deploy websites to production environments', 
                    'Optimize websites for performance'].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Description</h2>
                <div className="prose max-w-none mb-8">
                  <p className="mb-4">
                    This comprehensive course is designed to take you from beginner to confident web developer. Whether you're just starting out or looking to refresh your skills, this course covers everything you need to know.
                  </p>
                  <p className="mb-4">
                    You'll learn how to build modern, responsive websites using HTML, CSS, and JavaScript. We'll cover the latest best practices and techniques used by professional developers in the industry.
                  </p>
                  <p className="mb-4">
                    Through hands-on projects and real-world examples, you'll gain practical experience that you can apply to your own websites or use to kickstart a career in web development.
                  </p>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
                <ul className="list-disc list-inside mb-8 space-y-2 text-gray-700">
                  <li>Basic computer skills</li>
                  <li>No prior programming experience needed - we'll start from the basics</li>
                  <li>A computer with internet access (Windows, Mac, or Linux)</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Who this course is for</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Absolute beginners with no prior programming experience</li>
                  <li>Anyone wanting to learn web development from scratch</li>
                  <li>Designers looking to expand their skills into development</li>
                  <li>Developers looking to refresh their fundamental skills</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'curriculum' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Course Curriculum</h2>
                  <div className="text-sm text-gray-600">
                    {course.lessons.length} lessons • {calculateTotalDuration()}
                  </div>
                </div>
                
                {course.lessons.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="border-b border-gray-200 last:border-0">
                        <div 
                          className="flex items-center justify-between bg-white p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleSection(lesson.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                              <p className="text-sm text-gray-500">{lesson.duration} minutes</p>
                            </div>
                          </div>
                          <button>
                            {expandedSections[lesson.id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                        
                        {expandedSections[lesson.id] && (
                          <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700 mb-4">{lesson.description}</p>
                            <div className="flex items-center">
                              <Play className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm text-gray-600">Video Lesson</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No lessons available yet</h3>
                    <p className="text-gray-600">Course curriculum is being developed</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About the Instructor</h2>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt={course.instructorName} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                    />
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{course.instructorName}</h3>
                      <p className="text-gray-600 mb-4">Web Development Instructor & Software Engineer</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="text-gray-700">4.8 Instructor Rating</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-blue-500 mr-1" />
                          <span className="text-gray-700">3 Courses</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-gray-700">2,984 Students</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700">
                        Jane is a passionate web developer with over 8 years of industry experience. She specializes in front-end development and has worked with numerous startups and Fortune 500 companies to build scalable, user-friendly web applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Course Card */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
              {/* Course Preview Image */}
              <div className="relative aspect-video">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <button className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors">
                    <Play className="h-6 w-6 text-blue-600" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
                  Preview Available
                </div>
              </div>
              
              {/* Course Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold text-blue-600">${course.price.toFixed(2)}</div>
                </div>
                
                <button
                  className={`w-full py-3 px-4 mb-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                    enrolling ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </button>
                
                <p className="text-center text-sm text-gray-500 mb-6">
                  30-Day Money-Back Guarantee
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Full Lifetime Access</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Access on Mobile and TV</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Certificate of Completion</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Gift this course
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Share with friends and colleagues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;