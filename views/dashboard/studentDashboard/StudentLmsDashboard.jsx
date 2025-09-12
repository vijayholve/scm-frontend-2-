import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip, CircularProgress, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import api from 'utils/apiService';
import { IconBook2 } from '@tabler/icons-react';
import { userDetails } from 'utils/apiService';

const CourseProgressCard = ({ course }) => {
    const navigate = useNavigate();
    const completionPercent = course.completionPercent || 0;
    const isCompleted = completionPercent >= 100;
    const progressColor = isCompleted ? 'success' : 'primary';

    const handleViewCourse = () => {
        // Assuming there's a view route for a specific course
        navigate(`/masters/lms/course/view/${course.id}`);
    };

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                }
            }}
            onClick={handleViewCourse}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h3" gutterBottom>
                        {course.title}
                    </Typography>
                    <Chip 
                        label={isCompleted ? 'Completed' : 'In Progress'} 
                        color={progressColor} 
                        size="small" 
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {course.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2">{completionPercent}%</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={completionPercent} 
                        color={progressColor}
                        sx={{ height: 8, borderRadius: 4 }} 
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

const StudentLmsDashboard = () => {
    const { user } = useSelector((state) => state.user);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accountId = user?.accountId;
    const studentId = user?.id;

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            if (!accountId || !studentId) {
                setError('User not authenticated.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get(`/api/lms/course/enrollment/${accountId}/${studentId}`);
                setCourses(response.data || []);
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [user]);

    if (loading) {
        return (
            <Grid item xs={12} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid item xs={12} sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Grid>
        );
    }

    return (
        <Grid container spacing={gridSpacing} sx={{ p: 2, pb: 4 }}>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                    <IconBook2 />
                    <Typography variant="h4">My Courses</Typography>
                </Box>
            </Grid>
            {courses.length > 0 ? (
                courses.map((course) => (
                    <Grid item xs={12} md={6} lg={4} key={course.id}>
                        <CourseProgressCard course={course} />
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <Typography variant="body1" align="center" color="text.secondary">
                        You are not enrolled in any courses yet.
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default StudentLmsDashboard;