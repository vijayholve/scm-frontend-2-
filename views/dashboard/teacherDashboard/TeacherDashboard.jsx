import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api, { userDetails } from 'utils/apiService';
import TeacherTimetableCard from './TeacherTimetableCard';
import TeacherAssignmentChart from './TeacherAssignmentChart';
import TeacherQuickActionsCard from './TeacherQuickActionsCard';
// import TeacherSummaryCard from './TeacherSummaryCard';


const TeacherDashboard = () => {
    const scdData = useSelector((state) => state.user.scdData);
    console.log("SCD Data in Dashboard:", scdData);
  const { user } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    recentSubmissions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/dashboard/teacher/${user.id}`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
      }
    };

    // � � if (user && user.id) {
    // � � � fetchData();
    // � � }
  }, [user]);

  return (
    <Grid container spacing={3}>
      {/* Top row with three cards */}
      <Grid item xs={12} sm={12} md={6} >
        <TeacherTimetableCard />
      </Grid>
      <Grid item xs={12} sm={12} md={6} >
        <TeacherQuickActionsCard />
      </Grid>
      <Grid item xs={12} sm={12} md={6} >
        <TeacherAssignmentChart />
      </Grid>
      {/* Bottom section with summary values */}
      <Grid item xs={12}>
        {/* <TeacherSummaryCard /> */}

      </Grid>
    </Grid>
  );
};

export default TeacherDashboard;
