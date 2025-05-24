import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useNotification } from '../contexts/NotificationContext';
import { Course, Quiz as QuizType, Question } from '../types';

const Quiz: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const { fetchCourseById, fetchQuizById } = useCourses();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!courseId || !quizId) return;
      
      setLoading(true);
      try {
        const courseData = await fetchCourseById(courseId);
        if (!courseData) {
          navigate('/courses');
          return;
        }
        
        setCourse(courseData);
        
        const quizData = await fetchQuizById(courseId, quizId);
        if (!quizData) {
          navigate(`/courses/${courseId}`);
          return;
        }
        
        setQuiz(quizData);
        
        // Initialize time left
        if (quizData.duration) {
          setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        addNotification('error', 'Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [courseId, quizId, fetchCourseById, fetchQuizById, navigate, addNotification]);
  
  // Timer countdown effect
  useEffect(() => {
    if (!quizSubmitted && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === null || prevTime <= 1) {
            clearInterval(timer);
            // Auto-submit when time is up
            if (!quizSubmitted) {
              submitQuiz();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeLeft, quizSubmitted]);
  
  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const goToNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const submitQuiz = () => {
    if (!quiz) return;
    
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedOptions[question.id] === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const percentageScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(percentageScore);
    setQuizSubmitted(true);
    
    if (percentageScore >= 70) {
      addNotification('success', `Congratulations! You passed the quiz with ${percentageScore}% score.`);
    } else {
      addNotification('warning', `You scored ${percentageScore}%. You need 70% to pass this quiz.`);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
  
  if (!course || !quiz) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
          <p className="text-gray-600 mb-8">The quiz you're looking for doesn't exist or has been removed.</p>
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
  
  const currentQuestion: Question | undefined = quiz.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Question Error</h2>
          <p className="text-gray-600 mb-8">There was an error loading this question.</p>
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
    <div className="min-h-screen bg-gray-100">
      {/* Quiz Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                className="p-2 rounded-md hover:bg-gray-100 mr-2"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
                <p className="text-sm text-gray-500">{course.title}</p>
              </div>
            </div>
            
            {timeLeft !== null && !quizSubmitted && (
              <div className={`flex items-center p-2 rounded-md ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {quizSubmitted ? (
            // Quiz Results
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-8">
                  {score !== null && score >= 70 ? (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  )}
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {score !== null && score >= 70 ? 'Congratulations!' : 'Keep Practicing!'}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {score !== null && score >= 70 
                      ? `You've passed the quiz with a score of ${score}%.` 
                      : `You scored ${score}%. You need 70% to pass this quiz.`}
                  </p>
                  
                  {score !== null && (
                    <div className="inline-block bg-gray-100 rounded-full p-1 mb-6">
                      <div className="flex items-center">
                        <div 
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            score >= 70 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          Your Score: {score}%
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Passing Score: 70%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Review Your Answers</h3>
                
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                        {selectedOptions[question.id] === question.correctOption ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Correct
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Incorrect
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{question.text}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-3 rounded-lg ${
                              optionIndex === question.correctOption
                                ? 'bg-green-50 border border-green-200'
                                : selectedOptions[question.id] === optionIndex
                                  ? 'bg-red-50 border border-red-200'
                                  : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                {optionIndex === question.correctOption ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : selectedOptions[question.id] === optionIndex ? (
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                )}
                              </div>
                              <span className="ml-2 text-gray-700">{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedOptions[question.id] !== question.correctOption && (
                        <div className="mt-3 text-sm text-gray-600">
                          <p className="font-medium">Correct Answer: {question.options[question.correctOption]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate(`/courses/${courseId}`)}
                  >
                    Back to Course
                  </button>
                  
                  {score !== null && score < 70 && (
                    <button
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => {
                        setSelectedOptions({});
                        setQuizSubmitted(false);
                        setCurrentQuestionIndex(0);
                        setScore(null);
                        if (quiz.duration) {
                          setTimeLeft(quiz.duration * 60);
                        }
                      }}
                    >
                      Retry Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Quiz Questions
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {currentQuestion.text}
                </h2>
                
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOptions[currentQuestion.id] === optionIndex
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.id, optionIndex)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                          selectedOptions[currentQuestion.id] === optionIndex
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-400'
                        }`}>
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <span className={`${
                          selectedOptions[currentQuestion.id] === optionIndex ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                      onClick={goToNextQuestion}
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={submitQuiz}
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Question Navigation (when not submitted) */}
          {!quizSubmitted && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Questions</h3>
              <div className="flex flex-wrap gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : selectedOptions[quiz.questions[index].id] !== undefined
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <span>Current Question</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-gray-100 mr-2"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;