import React, { createContext, useContext, useState, useEffect } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Auto-remove notifications when their duration expires
    const timeouts = notifications.map(notification => {
      if (notification.duration) {
        return setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }
      return null;
    });

    return () => {
      timeouts.forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [notifications]);

  const addNotification = (type: NotificationType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const value = {
    notifications,
    addNotification,
    removeNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};