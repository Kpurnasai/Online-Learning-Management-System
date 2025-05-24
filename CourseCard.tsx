import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  const calculateTotalDuration = () => {
    if (!course.lessons || course.lessons.length === 0) {
      return 'No lessons yet';
    }
    
    const totalMinutes = course.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            {course.level}
          </span>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="flex-grow p-5 flex flex-col">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-2">
          {course.categories && course.categories.map((category, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-auto">
          By <span className="font-medium text-gray-700">{course.instructorName}</span>
        </p>
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-4"></div>
        
        {/* Course Stats */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrolled.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{calculateTotalDuration()}</span>
          </div>
        </div>
        
        {/* Progress Bar (if enrolled) */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
          </div>
        )}
      </div>
      
      {/* Price Tag */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600">${course.price.toFixed(2)}</span>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;