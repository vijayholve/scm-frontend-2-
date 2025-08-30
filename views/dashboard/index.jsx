// src/views/dashboard/index.jsx

import React, { lazy } from 'react';
import { useSelector } from 'react-redux';
import Loadable from 'ui-component/Loadable';

// project imports
const AdminDashboard = Loadable(lazy(() => import('./AdminDashboard')));
const TeacherDashboard = Loadable(lazy(() => import('./teacherDashboard/TeacherDashboard')));
const StudentDashboardV1 = Loadable(lazy(() => import('./studentDashboard/StudentDashboardV1')));

const DashboardDefault = () => {
  const user = useSelector((state) => state.user.user);
  const userType = user?.type;
  console.log("User Type:", userType);

  switch (userType) {
    case 'STUDENT':
      return <StudentDashboardV1 />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'ADMIN':
    default:
      return <AdminDashboard />;
  }
};

export default DashboardDefault;