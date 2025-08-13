import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
// import api, { userDetails } from 'utils/apiService';
import api from 'utils/apiService'; // Assuming you have a centralized API handler
import { useSelector } from 'react-redux';

const StudentDashboardV1 = () => {
  const { user } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    upcomingAssignments: [],
    recentGrades: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pagination = {
          page: 0,
          size: 1000,
          sortBy: "id",
          sortDir: "asc"
        }
        const response = await api.post(`/dashboard/student/${user.id}`, pagination);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching student dashboard data:", error);
      }
    };

    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  return (
    <Grid container spacing={3}>
      {/* Enrolled Courses */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              My Courses
            </Typography>
            <List>
              {dashboardData.courses.map((course, index) => (
                <ListItem key={index}>
                  <ListItemText primary={course.name} secondary={`Instructor: ${course.instructor}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Assignments */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Upcoming Assignments
            </Typography>
            <List>
              {dashboardData.upcomingAssignments.map((assignment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={assignment.title} secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Grades */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
              Recent Grades
            </Typography>
            <List>
              {dashboardData.recentGrades.map((grade, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText primary={grade.assignmentTitle} secondary={`Course: ${grade.courseName}`} />
                    <Typography variant="h6">{grade.score}%</Typography>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentDashboardV1;