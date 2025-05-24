import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Trash2, GripVertical } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useNotification } from '../contexts/NotificationContext';
import { Course, Lesson, Quiz } from '../types';

const CourseCreator: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { createCourse, updateCourse, fetchCourseById } = useCourses();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'curriculum' | 'pricing'>('basic');
  
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: '',
    description: '',
    thumbnail: '',
    categories: [],
    level: 'Beginner',
    price: 0,
    lessons: [],
    quizzes: []
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [draggedLessonIndex, setDraggedLessonIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      
      try {
        const course = await fetchCourseById(courseId);
        if (course) {
          setCourseData(course);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        addNotification('error', 'Failed to load course data');
      }
    };
    
    loadCourse();
  }, [courseId, fetchCourseById, addNotification]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    setCourseData(prev => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory.trim()]
    }));
    setNewCategory('');
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      categories: prev.categories?.filter(cat => cat !== categoryToRemove)
    }));
  };
  
  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      description: '',
      content: '',
      videoUrl: '',
      duration: 0,
      order: courseData.lessons?.length || 0
    };
    
    setCourseData(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
  };
  
  const handleUpdateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.map(lesson =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      )
    }));
  };
  
  const handleRemoveLesson = (lessonId: string) => {
    setCourseData(prev => ({
      ...prev,
      lessons: prev.lessons?.filter(lesson => lesson.id !== lessonId)
    }));
  };
  
  const handleDragStart = (index: number) => {
    setDraggedLessonIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLessonIndex === null) return;
    
    const lessons = [...(courseData.lessons || [])];
    const draggedLesson = lessons[draggedLessonIndex];
    
    lessons.splice(draggedLessonIndex, 1);
    lessons.splice(index, 0, draggedLesson);
    
    // Update order property for each lesson
    lessons.forEach((lesson, idx) => {
      lesson.order = idx;
    });
    
    setCourseData(prev => ({
      ...prev,
      lessons
    }));
    setDraggedLessonIndex(index);
  };
  
  const handleDragEnd = () => {
    setDraggedLessonIndex(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseData.title || !courseData.description) {
      addNotification('warning', 'Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (courseId) {
        await updateCourse(courseId, courseData);
        addNotification('success', 'Course updated successfully');
      } else {
        const newCourse = await createCourse(courseData);
        addNotification('success', 'Course created successfully');
        navigate(`/instructor/courses/${newCourse.id}/edit`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification('error', 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {courseId ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-600 mt-2">
            {courseId
              ? 'Update your course information and curriculum'
              : 'Start creating your course by filling in the information below'}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                type="button"
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'basic'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Information
              </button>
              <button
                type="button"
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
                type="button"
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'pricing'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </button>
            </nav>
          </div>
          
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <div className="flex space-x-4">
                  <input
                    type="url"
                    id="thumbnail"
                    name="thumbnail"
                    value={courseData.thumbnail}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {courseData.categories?.map(category => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddCategory} className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a category"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </form>
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={courseData.level}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Curriculum */}
          {activeTab === 'curriculum' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-800">Course Lessons</h2>
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Lesson
                </button>
              </div>
              
              <div className="space-y-4">
                {courseData.lessons?.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="cursor-move p-2 text-gray-400 hover:text-gray-600">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleUpdateLesson(lesson.id, { title: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          placeholder="Lesson Title"
                        />
                        
                        <textarea
                          value={lesson.description}
                          onChange={(e) => handleUpdateLesson(lesson.id, { description: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          placeholder="Lesson Description"
                          rows={2}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="url"
                            value={lesson.videoUrl}
                            onChange={(e) => handleUpdateLesson(lesson.id, { videoUrl: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Video URL"
                          />
                          
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => handleUpdateLesson(lesson.id, { duration: parseInt(e.target.value) })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Duration (minutes)"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(lesson.id)}
                        className="ml-4 p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!courseData.lessons || courseData.lessons.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No lessons yet</h3>
                    <p className="text-gray-600 mb-4">Start adding lessons to your course</p>
                    <button
                      type="button"
                      onClick={handleAddLesson}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add First Lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Pricing */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Pricing Tips</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Consider the course content and value when setting the price</li>
                  <li>Research similar courses in your category</li>
                  <li>You can adjust the price later if needed</li>
                  <li>Consider offering launch discounts</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/instructor/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <div className="flex space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Save as Draft
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Publish Course'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreator;