import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import api, { userDetails } from 'utils/apiService';
import TeacherTimetableCard from './TeacherTimetableCard';
import TeacherAssignmentChart from './TeacherAssignmentChart';
import TeacherQuickActionsCard from './TeacherQuickActionsCard';

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    recentSubmissions: []
  });

  // local SCD state (prefill from cache if present)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const response = await api.get(`/dashboard/teacher/${user.id}`);
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
      }
    };

    fetchData();
  }, [user]);

  // Ensure SCD loaded on mount and after login (when user changes)


  // if you need accountId same as userDetails.getAccountId()
  const accountId = userDetails.getAccountId();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6}>
        <TeacherTimetableCard/>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TeacherQuickActionsCard/>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TeacherAssignmentChart/>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};

export default TeacherDashboard;
