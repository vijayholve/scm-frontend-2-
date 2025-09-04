// src/views/masters/notifications/index.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NotificationList from './NotificationList';
import NotificationCreateEdit from './NotificationCreateEdit';
import NotificationView from './NotificationView';

// Dummy Data
const dummyNotifications = [
  {
    id: 1,
    title: "Exam Timetable Released",
    message: "The exam timetable for Class 8A has been uploaded. Please check the Exam Module.",
    audience: "Class 8A",
    userType: ["STUDENT"],
    status: "Active",
    priority: "High",
    rollingBanner: true,
    type: "Info",
    activeFrom: "2025-09-01",
    activeTo: "2025-09-05",
    createdBy: "Admin"
  },
  {
    id: 2,
    title: "Fee Due Reminder",
    message: "Fee payment is due on Sep 5th. Please pay at your earliest convenience.",
    audience: "Entire School",
    userType: ["STUDENT", "PARENT"],
    status: "Active",
    priority: "Normal",
    rollingBanner: true,
    type: "Reminder",
    activeFrom: "2025-09-01",
    activeTo: "2025-09-05",
    createdBy: "Admin"
  },
  {
    id: 3,
    title: "Holiday Notice",
    message: "Tomorrow is a holiday for Ganesh Chaturthi.",
    audience: "All Parents",
    userType: ["PARENT"],
    status: "Expired",
    priority: "Normal",
    rollingBanner: false,
    type: "Info",
    activeFrom: "2025-08-30",
    activeTo: "2025-08-30",
    createdBy: "Admin"
  }
];

const NotificationIndex = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const { action, id } = useParams();

  const handleSaveNotification = (newNotification) => {
    if (id) {
        // Update existing notification
        setNotifications(prev => prev.map(n => n.id === newNotification.id ? { ...newNotification, id: parseInt(id) } : n));
    } else {
        // Add new notification
        const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
        setNotifications(prev => [...prev, { ...newNotification, id: newId, status: 'Active' }]);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  switch (action) {
    case 'add':
      return <NotificationCreateEdit onSave={handleSaveNotification} />;
    case 'edit':
      return <NotificationCreateEdit onSave={handleSaveNotification} />;
    case 'view':
      return <NotificationView />;
    default:
      return <NotificationList notifications={notifications} onDelete={handleDeleteNotification} />;
  }
};

export default NotificationIndex;