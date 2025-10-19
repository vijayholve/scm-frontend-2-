import React from 'react'
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Alert, Box, CircularProgress, Avatar, Tooltip } from '@mui/material';
import StudentAttendanceChart from 'views/dashboard/studentDashboard/StudentAttendanceChart';
import StudentLmsDashboard from 'views/dashboard/studentDashboard/StudentLmsDashboard';
import { useParams } from 'react-router-dom';

const StudentDashboardView = ({ studentId }) => {
  
  return (
    <>
      {/* <Grid container spacing={3}>
        <Grid container spacing={3}>
       
          <Grid item xs={12} md={6} lg={4}>
            <StudentAttendanceChart studentId={studentId} />
          </Grid>
          <Grid item xs={12}>
            <StudentLmsDashboard studentId={studentId} />
          </Grid>
        </Grid>
      </Grid> */}
      {/* make it simple dashboard with lms and attendance and tifull with correct allighnemnt  */}
        <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
            <StudentAttendanceChart studentId={studentId} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
            <StudentLmsDashboard studentId={studentId} />
            </Grid>
        </Grid>
    </>
    );
}

export default StudentDashboardView