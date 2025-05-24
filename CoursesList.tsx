import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, XCircle } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';

const CoursesList: React.FC = () => {
  const { fetchCourses, loading } = useCourses();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100);
  
  // Available filter options (dynamically generated from courses)
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  
  useEffect(() => {
    const loadCourses = async () => {
      const allCourses = await fetchCourses();
      setCourses(allCourses);
      setFilteredCourses(allCourses);
      
      // Extract available categories and levels
      const categories = new Set<string>();
      const levels = new Set<string>();
      
      allCourses.forEach(course => {
        if (course.categories) {
          course.categories.forEach(cat => categories.add(cat));
        }
        if (course.level) {
          levels.add(course.level);
        }
      });
      
      setAvailableCategories(Array.from(categories));
      setAvailableLevels(Array.from(levels));
    };
    
    loadCourses();
  }, [fetchCourses]);
  
  useEffect(() => {
    // Parse search query from URL if present
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);
  
  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...courses];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(course => 
        course.categories && course.categories.some(cat => selectedCategories.includes(cat))
      );
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      result = result.filter(course => 
        course.level && selectedLevels.includes(course.level)
      );
    }
    
    // Apply price filter
    result = result.filter(course => course.price <= priceRange);
    
    setFilteredCourses(result);
  }, [searchQuery, selectedCategories, selectedLevels, priceRange, courses]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    navigate(`/courses?search=${searchQuery}`);
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange(100);
    setSearchQuery('');
    navigate('/courses');
  };
  
  const hasActiveFilters = selectedCategories.length > 0 || selectedLevels.length > 0 || priceRange < 100 || searchQuery;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore Courses</h1>
        <p className="text-gray-600 mt-2">Discover top-quality courses to expand your knowledge and skills</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search for courses..."
            className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </form>
        
        {/* Filter Toggle Button */}
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 lg:ml-4"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-700" />
          <span className="font-medium text-gray-700">Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
              {selectedCategories.length + selectedLevels.length + (priceRange < 100 ? 1 : 0) + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Filters Sidebar */}
        {isFilterOpen && (
          <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mr-0 lg:mr-8 mb-6 lg:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
              {hasActiveFilters && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
              <div className="space-y-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Levels */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Levels</h4>
              <div className="space-y-2">
                {availableLevels.map(level => (
                  <div key={level} className="flex items-center">
                    <input
                      id={`level-${level}`}
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`level-${level}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">Price</h4>
                <span className="text-sm text-gray-600">${priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$0</span>
                <span>$100</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Courses Grid */}
        <div className="flex-1">
          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center text-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Active Filters:</span>
              </div>
              
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  Search: {searchQuery}
                  <button className="ml-1" onClick={() => setSearchQuery('')}>
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedCategories.map(category => (
                <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  {category}
                  <button className="ml-1" onClick={() => toggleCategory(category)}>
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {selectedLevels.map(level => (
                <span key={level} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  {level}
                  <button className="ml-1" onClick={() => toggleLevel(level)}>
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {priceRange < 100 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                  Price: ${priceRange} or less
                  <button className="ml-1" onClick={() => setPriceRange(100)}>
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesList;