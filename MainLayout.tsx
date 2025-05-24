import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, BookOpen, Home, User, LogOut, ChevronDown, Bookmark, Settings, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import NotificationList from '../components/NotificationList';

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isInstructor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { notifications } = useNotification();

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/login') && !location.pathname.includes('/register')) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header 
        className={`sticky top-0 z-20 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and brand */}
            <div className="flex items-center">
              <div 
                className="flex items-center text-2xl font-bold text-blue-600 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <BookOpen className="h-8 w-8 mr-2" />
                <span>EduLearn</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="py-2 pl-10 pr-4 w-64 rounded-full bg-gray-100 focus:bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </form>

              <nav className="flex space-x-6">
                <a 
                  href="/" 
                  onClick={(e) => { e.preventDefault(); navigate('/'); closeMobileMenu(); }}
                  className={`font-medium hover:text-blue-600 transition-colors ${
                    location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Dashboard
                </a>
                <a 
                  href="/courses" 
                  onClick={(e) => { e.preventDefault(); navigate('/courses'); closeMobileMenu(); }}
                  className={`font-medium hover:text-blue-600 transition-colors ${
                    location.pathname.includes('/courses') ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Courses
                </a>
                {isInstructor && (
                  <a 
                    href="/instructor/dashboard" 
                    onClick={(e) => { e.preventDefault(); navigate('/instructor/dashboard'); closeMobileMenu(); }}
                    className={`font-medium hover:text-blue-600 transition-colors ${
                      location.pathname.includes('/instructor') ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    Teach
                  </a>
                )}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                  >
                    <Bell className="h-6 w-6 text-gray-700" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-30">
                      <NotificationList />
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <img 
                      src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                    />
                    <span className="hidden lg:inline-block font-medium text-gray-700">
                      {currentUser?.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-30">
                      <a 
                        href="/profile" 
                        onClick={(e) => { e.preventDefault(); navigate('/profile'); setIsProfileDropdownOpen(false); }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </a>
                      <a 
                        href="/bookmarks" 
                        onClick={(e) => { e.preventDefault(); setIsProfileDropdownOpen(false); }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Bookmarks
                      </a>
                      <a 
                        href="/settings" 
                        onClick={(e) => { e.preventDefault(); setIsProfileDropdownOpen(false); }}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button 
                        onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="container mx-auto px-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="py-2 pl-10 pr-4 w-full rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </form>

              <nav className="flex flex-col space-y-3">
                <a 
                  href="/" 
                  onClick={(e) => { e.preventDefault(); navigate('/'); closeMobileMenu(); }}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100"
                >
                  <Home className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a 
                  href="/courses" 
                  onClick={(e) => { e.preventDefault(); navigate('/courses'); closeMobileMenu(); }}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100"
                >
                  <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-medium">Courses</span>
                </a>
                {isInstructor && (
                  <a 
                    href="/instructor/dashboard" 
                    onClick={(e) => { e.preventDefault(); navigate('/instructor/dashboard'); closeMobileMenu(); }}
                    className="flex items-center p-2 rounded-md hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium">Teach</span>
                  </a>
                )}
                <a 
                  href="/profile" 
                  onClick={(e) => { e.preventDefault(); navigate('/profile'); closeMobileMenu(); }}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100"
                >
                  <User className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-medium">Profile</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="h-5 w-5 mr-3 text-blue-600" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center text-xl font-bold text-blue-600 mb-4">
                <BookOpen className="h-6 w-6 mr-2" />
                <span>EduLearn</span>
              </div>
              <p className="text-gray-600 mb-4">
                Empowering education through technology. Learn anywhere, anytime.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">Courses</a></li>
                <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQs</a></li>
                <li><a href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Subscribe</h3>
              <p className="text-gray-600 mb-4">Get the latest updates and offers.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 EduLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;