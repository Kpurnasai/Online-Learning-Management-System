import React, { createContext, useContext, useState } from 'react';
import { Course, Lesson, Quiz } from '../types';

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => Promise<Course[]>;
  fetchCourseById: (courseId: string) => Promise<Course | undefined>;
  fetchLessonById: (courseId: string, lessonId: string) => Promise<Lesson | undefined>;
  fetchQuizById: (courseId: string, quizId: string) => Promise<Quiz | undefined>;
  createCourse: (courseData: Partial<Course>) => Promise<Course>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<Course>;
  enrollInCourse: (courseId: string) => Promise<void>;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

// Mock course data
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructorId: '2',
    instructorName: 'Jane Smith',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    categories: ['Web Development', 'Programming'],
    level: 'Beginner',
    price: 49.99,
    rating: 4.7,
    enrolled: 1245,
    lessons: [
      {
        id: '1',
        title: 'HTML Fundamentals',
        description: 'Learn the basic structure of HTML documents and common elements.',
        content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser...',
        videoUrl: 'https://www.example.com/videos/html-basics',
        duration: 45,
        order: 1
      },
      {
        id: '2',
        title: 'CSS Styling',
        description: 'Learn how to style HTML elements using CSS.',
        content: 'CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML...',
        videoUrl: 'https://www.example.com/videos/css-styling',
        duration: 50,
        order: 2
      }
    ],
    quizzes: [
      {
        id: '1',
        title: 'HTML Quiz',
        description: 'Test your knowledge of HTML basics',
        duration: 15,
        questions: [
          {
            id: '1',
            text: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'Hyper Transfer Markup Language',
              'High Technology Modern Language',
              'Hyper Technical Meta Language'
            ],
            correctOption: 0
          },
          {
            id: '2',
            text: 'Which tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctOption: 1
          }
        ]
      }
    ],
    progress: 25
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and machine learning concepts.',
    instructorId: '2',
    instructorName: 'Jane Smith',
    thumbnail: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    categories: ['Data Science', 'Programming'],
    level: 'Intermediate',
    price: 79.99,
    rating: 4.8,
    enrolled: 987,
    lessons: [
      {
        id: '1',
        title: 'Introduction to Data Analysis',
        description: 'Learn the basics of data analysis and statistical concepts.',
        content: 'Data analysis is a process of inspecting, cleansing, transforming, and modeling data...',
        videoUrl: 'https://www.example.com/videos/data-analysis-intro',
        duration: 60,
        order: 1
      }
    ],
    quizzes: [],
    progress: 0
  },
  {
    id: '3',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native.',
    instructorId: '2',
    instructorName: 'Jane Smith',
    thumbnail: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    categories: ['Mobile Development', 'React'],
    level: 'Advanced',
    price: 99.99,
    rating: 4.6,
    enrolled: 753,
    lessons: [],
    quizzes: [],
    progress: 0
  }
];

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (): Promise<Course[]> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return courses;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseById = async (courseId: string): Promise<Course | undefined> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return courses.find(course => course.id === courseId);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonById = async (courseId: string, lessonId: string): Promise<Lesson | undefined> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const course = courses.find(c => c.id === courseId);
      return course?.lessons.find(lesson => lesson.id === lessonId);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizById = async (courseId: string, quizId: string): Promise<Quiz | undefined> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const course = courses.find(c => c.id === courseId);
      return course?.quizzes.find(quiz => quiz.id === quizId);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        id: String(courses.length + 1),
        title: courseData.title || 'Untitled Course',
        description: courseData.description || '',
        instructorId: courseData.instructorId || '',
        instructorName: courseData.instructorName || '',
        thumbnail: courseData.thumbnail || 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        categories: courseData.categories || [],
        level: courseData.level || 'Beginner',
        price: courseData.price || 0,
        rating: 0,
        enrolled: 0,
        lessons: courseData.lessons || [],
        quizzes: courseData.quizzes || [],
        progress: 0
      };
      
      setCourses([...courses, newCourse]);
      return newCourse;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, ...courseData } : course
      );
      
      setCourses(updatedCourses);
      const updatedCourse = updatedCourses.find(course => course.id === courseId);
      
      if (!updatedCourse) {
        throw new Error('Course not found');
      }
      
      return updatedCourse;
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, enrolled: course.enrolled + 1 } : course
      );
      
      setCourses(updatedCourses);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    courses,
    loading,
    fetchCourses,
    fetchCourseById,
    fetchLessonById,
    fetchQuizById,
    createCourse,
    updateCourse,
    enrollInCourse
  };

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};

export const useCourses = (): CoursesContextType => {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};