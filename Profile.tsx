import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { User, Mail, Camera, CheckCircle, Book, Certificate, Clock, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings'>('profile');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: 'I am passionate about learning new technologies and skills.',
    jobTitle: 'Software Developer',
    company: 'Tech Innovations',
    website: 'https://example.com',
    location: 'San Francisco, CA'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile in the database
    addNotification('success', 'Profile updated successfully!');
    setIsEditing(false);
  };
  
  const achievements = [
    { 
      id: '1', 
      type: 'course', 
      title: 'Introduction to Web Development', 
      date: '2025-03-15', 
      description: 'Completed with a score of 92%',
      icon: <Book className="h-8 w-8 text-blue-600" />
    },
    { 
      id: '2', 
      type: 'certificate', 
      title: 'Web Development Certificate', 
      date: '2025-03-20', 
      description: 'Professional certification in web development',
      icon: <Certificate className="h-8 w-8 text-purple-600" />
    },
    { 
      id: '3', 
      type: 'milestone', 
      title: '10 Hours of Learning', 
      date: '2025-02-28', 
      description: 'Dedicated to continuous education',
      icon: <Clock className="h-8 w-8 text-green-600" />
    },
    { 
      id: '4', 
      type: 'badge', 
      title: 'Fast Learner', 
      date: '2025-01-15', 
      description: 'Completed 5 courses in one month',
      icon: <Award className="h-8 w-8 text-yellow-600" />
    }
  ];
  
  const stats = [
    { label: 'Courses Completed', value: 3 },
    { label: 'Certificates Earned', value: 1 },
    { label: 'Hours Learned', value: 12.5 },
    { label: 'Achievements', value: 5 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:space-x-6">
            <div className="relative">
              <img 
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Camera className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <div className="mt-6 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h1>
              <p className="text-gray-600">
                {formData.jobTitle} {formData.company ? `at ${formData.company}` : ''}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {formData.location}
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-auto flex space-x-3">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'achievements'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'settings'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                              Job Title
                            </label>
                            <input
                              type="text"
                              id="jobTitle"
                              name="jobTitle"
                              value={formData.jobTitle}
                              onChange={handleChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                              Website
                            </label>
                            <input
                              type="url"
                              id="website"
                              name="website"
                              value={formData.website}
                              onChange={handleChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
                        <p className="text-gray-700">{formData.bio}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-700">{formData.email}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-700">{formData.website}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">Professional Information</h3>
                          <div className="space-y-2">
                            <p className="text-gray-700">{formData.jobTitle}</p>
                            <p className="text-gray-700">{formData.company}</p>
                            <p className="text-gray-700">{formData.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'achievements' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Your Achievements</h3>
                  
                  <div className="space-y-4">
                    {achievements.map(achievement => (
                      <div key={achievement.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg mr-4">
                          {achievement.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Account Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Email Notifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="course-updates"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="course-updates" className="ml-2 block text-gray-700">
                            Course updates and announcements
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-courses"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="new-courses" className="ml-2 block text-gray-700">
                            New course recommendations
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="marketing"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="marketing" className="ml-2 block text-gray-700">
                            Marketing and promotional emails
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Privacy Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="profile-visibility"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="profile-visibility" className="ml-2 block text-gray-700">
                            Make my profile visible to other students
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="course-progress"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="course-progress" className="ml-2 block text-gray-700">
                            Show my course progress and achievements
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        This will permanently delete your account and all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          {/* Latest Certificates */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Latest Certificate</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Certificate className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-800">Web Development Certificate</h4>
                    <p className="text-sm text-gray-600 mt-1">Issued on March 20, 2025</p>
                    <div className="flex items-center mt-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">Verified credential</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View Certificate
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Stats */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Learning Activity</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
                    <span className="text-sm text-gray-600">3 of 5 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Course Completion</span>
                    <span className="text-sm text-gray-600">2 of 5 courses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">Learning Streak</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={i} className="text-center">
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                          i < 4 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {i < 3 && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    You're on a 3-day learning streak! 🔥
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

export default Profile;