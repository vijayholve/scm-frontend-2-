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
import TeacherClassesList from '../profile/TeacherClassesList';

/**
 * TeacherView Component
 * Displays detailed information for a single teacher in a read-only format.
 * Fetches teacher data based on the ID from URL parameters.
 */
const TeacherView = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches teacher data from the API.
     * Sets loading state, handles success and error, and updates teacherData state.
     */
    const fetchTeacherDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`api/users/getById?id=${id}`);
        if (response.data) {
          // Augment teacherData with dummy timeSpentOn and worksWith for demonstration
          // In a real application, these would come from the API or another data source
          const augmentedData = {
            ...response.data,
            timeSpentOn: [
              { icon: null, text: "Curriculum Development" },
              { icon: null, text: "Student Mentoring" },
              { icon: null, text: "Lesson Planning" },
            ],
            worksWith: [
              { name: "Principal A", avatar: "https://placehold.co/40x40/FF5733/FFFFFF?text=PA" },
              { name: "Counselor B", avatar: "https://placehold.co/40x40/33FF57/FFFFFF?text=CB" },
            ]
          };
          setTeacherData(augmentedData);
          setError(null);
        } else {
          setError('Teacher not found.');
        }
      } catch (err) {
        console.error('Failed to fetch teacher details:', err);
        setError('Failed to load teacher details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherDetails();
    } else {
      setLoading(false);
      setError('No teacher ID provided.');
    }
  }, [id]); // Re-fetch if ID changes

  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  if (loading) {
    return (
      <MainCard title="Loading Teacher Details">
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
          <BackButton BackUrl="/masters/teachers" />
        </Box>
      </MainCard>
    );
  }

  if (!teacherData) {
    return (
      <MainCard title="Teacher Not Found">
        <Typography sx={{ p: 2 }}>
          The teacher you are looking for does not exist.
        </Typography>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <BackButton BackUrl="/masters/teachers" />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard title={`Teacher Details: ${teacherData.firstName || ''} ${teacherData.lastName || ''}`}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Reusable Profile Header */}
        <ProfileHeader user={teacherData} onBack={handleBack} />

        {/* Reusable User Details Section */}
        <UserDetailsSection user={teacherData} />

        {/* Education Details */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Education Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Higher Qualification:</strong> {teacherData.higherQualification || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>School/College Name:</strong> {teacherData.schoolName || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>University Name:</strong> {teacherData.universityName || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Pass Out Year:</strong> {teacherData.passOutYear || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Percentage:</strong> {teacherData.percentage ? `${teacherData.percentage}%` : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Reusable Activity Section */}
        <Box sx={{ mt: 4 }}>
          <ActivitySection user={teacherData} />
        </Box>


     {/* <Box mt={3}>
       <TeacherClassesList teacher={teacherData} />
     </Box> */}

      </Paper>


      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <BackButton BackUrl="/masters/teachers" />
      </Box>
    </MainCard>
  );
};

export default TeacherView;
