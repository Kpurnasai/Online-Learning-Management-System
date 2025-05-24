import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle, PlayCircle, List, X, Download } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { Course, Lesson } from '../types';

const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { fetchCourseById, fetchLessonById } = useCourses();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !lessonId) return;
      
      setLoading(true);
      try {
        const courseData = await fetchCourseById(courseId);
        if (!courseData) {
          navigate('/courses');
          return;
        }
        
        setCourse(courseData);
        
        const lessonData = await fetchLessonById(courseId, lessonId);
        if (!lessonData) {
          // If lesson not found, try to navigate to the first lesson
          if (courseData.lessons && courseData.lessons.length > 0) {
            navigate(`/courses/${courseId}/lessons/${courseData.lessons[0].id}`);
          } else {
            navigate(`/courses/${courseId}`);
          }
          return;
        }
        
        setLesson(lessonData);
        
        // Load completed lessons from localStorage
        const savedCompletedLessons = localStorage.getItem(`course_${courseId}_completed`);
        if (savedCompletedLessons) {
          setCompletedLessons(JSON.parse(savedCompletedLessons));
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [courseId, lessonId, fetchCourseById, fetchLessonById, navigate]);
  
  const markLessonComplete = () => {
    if (!courseId || !lessonId) return;
    
    const updatedCompletedLessons = [...completedLessons];
    if (!completedLessons.includes(lessonId)) {
      updatedCompletedLessons.push(lessonId);
      setCompletedLessons(updatedCompletedLessons);
      localStorage.setItem(`course_${courseId}_completed`, JSON.stringify(updatedCompletedLessons));
    }
  };
  
  const navigateToLesson = (newLessonId: string) => {
    if (courseId) {
      navigate(`/courses/${courseId}/lessons/${newLessonId}`);
    }
  };
  
  const navigateToPreviousLesson = () => {
    if (!course || !lesson) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex > 0) {
      navigateToLesson(course.lessons[currentIndex - 1].id);
    }
  };
  
  const navigateToNextLesson = () => {
    if (!course || !lesson) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < course.lessons.length - 1) {
      navigateToLesson(course.lessons[currentIndex + 1].id);
    } else if (course.quizzes && course.quizzes.length > 0) {
      // Navigate to the first quiz if all lessons are completed
      navigate(`/courses/${courseId}/quizzes/${course.quizzes[0].id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Not Found</h2>
          <p className="text-gray-600 mb-8">The lesson you're looking for doesn't exist or has been removed.</p>
          <button 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{course.title}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{course.lessons.findIndex(l => l.id === lessonId) + 1}/{course.lessons.length}</span>
                  <span className="mx-2">•</span>
                  <span>Lesson {lesson.order}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={navigateToPreviousLesson}
                disabled={course.lessons.findIndex(l => l.id === lessonId) === 0}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-sm text-gray-600">
                {course.lessons.findIndex(l => l.id === lessonId) + 1} of {course.lessons.length}
              </span>
              <button 
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={navigateToNextLesson}
                disabled={course.lessons.findIndex(l => l.id === lessonId) === course.lessons.length - 1}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <List className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-80 bg-white border-r border-gray-200 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h2 className="font-semibold text-gray-800 mb-4">Course Content</h2>
            
            <div className="space-y-1">
              {course.lessons.map((courseLesson, index) => (
                <div 
                  key={courseLesson.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    courseLesson.id === lessonId
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => navigateToLesson(courseLesson.id)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {completedLessons.includes(courseLesson.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm ${courseLesson.id === lessonId ? 'font-medium' : 'text-gray-700'}`}>
                      {courseLesson.title}
                    </p>
                    <p className="text-xs text-gray-500">{courseLesson.duration} min</p>
                  </div>
                </div>
              ))}
              
              {course.quizzes && course.quizzes.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-3 pt-3">
                    <h3 className="font-medium text-gray-700 mb-2">Quizzes & Assessments</h3>
                  </div>
                  
                  {course.quizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                      onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}`)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-700">{quiz.title}</p>
                        <p className="text-xs text-gray-500">{quiz.duration} min</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Sidebar - Overlay */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div 
              className="absolute inset-0 bg-gray-900 bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            <div className="relative w-80 max-w-[80%] bg-white h-full overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-800">Course Content</h2>
                  <button 
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {course.lessons.map((courseLesson, index) => (
                    <div 
                      key={courseLesson.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        courseLesson.id === lessonId
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        navigateToLesson(courseLesson.id);
                        setIsSidebarOpen(false);
                      }}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {completedLessons.includes(courseLesson.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className={`text-sm ${courseLesson.id === lessonId ? 'font-medium' : 'text-gray-700'}`}>
                          {courseLesson.title}
                        </p>
                        <p className="text-xs text-gray-500">{courseLesson.duration} min</p>
                      </div>
                    </div>
                  ))}
                  
                  {course.quizzes && course.quizzes.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-3 pt-3">
                        <h3 className="font-medium text-gray-700 mb-2">Quizzes & Assessments</h3>
                      </div>
                      
                      {course.quizzes.map((quiz) => (
                        <div 
                          key={quiz.id}
                          className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            navigate(`/courses/${courseId}/quizzes/${quiz.id}`);
                            setIsSidebarOpen(false);
                          }}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-gray-700">{quiz.title}</p>
                            <p className="text-xs text-gray-500">{quiz.duration} min</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Lesson Content */}
        <div className="flex-grow p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Video Player */}
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              <div className="text-center">
                <button className="p-4 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors mb-4">
                  <PlayCircle className="h-12 w-12 text-blue-600" />
                </button>
                <p className="text-white text-sm">Video preview not available in demo</p>
              </div>
            </div>
            
            {/* Lesson Content */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
              <p className="text-gray-500 mb-6">Duration: {lesson.duration} minutes</p>
              
              <div className="prose max-w-none mb-8">
                <p className="mb-4">{lesson.content || 'Detailed lesson content would be displayed here in a real course.'}</p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl ultricies nunc, quis ultricies nisl nisl eget nisl.
                </p>
                <h2 className="text-xl font-semibold text-gray-800 my-4">Key Concepts</h2>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>First important concept explained in detail</li>
                  <li>Second key point that builds on the lesson fundamentals</li>
                  <li>Practical application example and real-world relevance</li>
                  <li>Common mistakes to avoid when implementing these techniques</li>
                </ul>
                <p className="mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
              
              {/* Resources */}
              <div className="border-t border-gray-200 pt-6 mb-8">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Additional Resources</h3>
                <div className="space-y-3">
                  <a 
                    href="#" 
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-5 w-5 text-gray-700 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Lesson Slides</p>
                      <p className="text-sm text-gray-500">PDF, 2.4 MB</p>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="h-5 w-5 text-gray-700 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Exercise Files</p>
                      <p className="text-sm text-gray-500">ZIP, 1.8 MB</p>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={navigateToPreviousLesson}
                  disabled={course.lessons.findIndex(l => l.id === lessonId) === 0}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous Lesson
                </button>
                
                <div className="flex space-x-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    onClick={markLessonComplete}
                  >
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Mark as Completed
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={navigateToNextLesson}
                    disabled={course.lessons.findIndex(l => l.id === lessonId) === course.lessons.length - 1}
                  >
                    Next Lesson
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;