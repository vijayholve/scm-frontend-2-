import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Paper, Divider, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import api from 'utils/apiService';

// Import reusable profile components
import ProfileHeader from 'ui-component/UserProfile/ProfileHeader';
import UserDetailsSection from 'ui-component/UserProfile/UserDetailsSection';
import ActivitySection from 'ui-component/UserProfile/ActivitySection';
import CollaborationSection from 'ui-component/UserProfile/CollaborationSection';
import StudentDashboardView from './StudentDashboardView';

/**
 * StudentView Component
 * Displays detailed information for a single student in a read-only format.
 * Fetches student data based on the ID from URL parameters.
 */
const StudentView = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches student data from the API.
     * Sets loading state, handles success and error, and updates studentData state.
     */
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`api/users/getById?id=${id}`);
        if (response.data) {
          // Augment studentData with dummy timeSpentOn and worksWith for demonstration
          const augmentedData = {
            ...response.data,
            timeSpentOn: [
              { icon: null, text: "Studying Math" },
              { icon: null, text: "Practicing English" },
              { icon: null, text: "Science Projects" },
            ],
            worksWith: [
              { name: "Classmate X", avatar: "https://placehold.co/40x40/FF0000/FFFFFF?text=CX" },
              { name: "Tutor Y", avatar: "https://placehold.co/40x40/0000FF/FFFFFF?text=TY" },
            ]
          };
          setStudentData(augmentedData);
          setError(null);
        } else {
          setError('Student not found.');
        }
      } catch (err) {
        console.error('Failed to fetch student details:', err);
        setError('Failed to load student details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentDetails();
    } else {
      setLoading(false);
      setError('No student ID provided.');
    }
  }, [id]); // Re-fetch if ID changes

  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  if (loading) {
    return (
      <MainCard title="Loading Student Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard title="Error">
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <BackButton BackUrl="/masters/students" />
        </Box>
      </MainCard>
    );
  }

  if (!studentData) {
    return (
      <MainCard title="Student Not Found">
        <Typography sx={{ p: 2 }}>
          The student you are looking for does not exist.
        </Typography>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <BackButton BackUrl="/masters/students" />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title={`Student Details: ${studentData.firstName || ''} ${studentData.lastName || ''}`}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Reusable Profile Header */}
        <ProfileHeader user={studentData} onBack={handleBack} />

        {/* Reusable User Details Section */}
        <UserDetailsSection user={studentData} />

        {/* Education Details (if applicable for students) */}
        {(studentData.higherQualification || studentData.schoolName || studentData.universityName || studentData.passOutYear || studentData.percentage) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Education Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Higher Qualification:</strong> {studentData.higherQualification || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>School/College Name:</strong> {studentData.schoolName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>University Name:</strong> {studentData.universityName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Pass Out Year:</strong> {studentData.passOutYear || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <strong>Percentage:</strong> {studentData.percentage ? `${studentData.percentage}%` : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reusable Activity Section */}
        <Box sx={{ mt: 4 }}>
          <ActivitySection user={studentData} />
        </Box>

        {/* Reusable Collaboration Section */}
        <Box sx={{ mt: 4 }}>
          <CollaborationSection user={studentData} />
        </Box>
        <Box sx={{ mt: 4 }}>
        <StudentDashboardView studentId={studentData.id} />
      </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <BackButton BackUrl="/masters/students" />
      </Box>
   
    </MainCard>
  );
};

export default StudentView;
