import React from 'react';
import { X, Bell, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
        <p>No notifications yet</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
      </div>
      <div>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-start"
          >
            <div className="flex-shrink-0 mr-3">
              {getIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">Just now</p>
            </div>
            <button 
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Clear all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationList;