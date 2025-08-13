import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
// import api from '../../../api'; 
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api, { userDetails } from 'utils/apiService';


const TeacherDashboard = () => {
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

    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  return (
    <Grid container spacing={3}>
      {/* My Courses */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              My Courses
            </Typography>
            <List>
              {dashboardData.courses.map((course) => (
                <ListItem key={course.id} secondaryAction={
                  <Button component={Link} to={`/courses/${course.id}`} variant="outlined">
                    View
                  </Button>
                }>
                  <ListItemText primary={course.name} secondary={`${course.studentCount} students`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Submissions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Recent Submissions
            </Typography>
            <List>
              {dashboardData.recentSubmissions.map((submission) => (
                <ListItem key={submission.id}>
                  <ListItemText
                    primary={`${submission.studentName} - ${submission.assignmentTitle}`}
                    secondary={`Submitted on: ${new Date(submission.submissionDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TeacherDashboard;