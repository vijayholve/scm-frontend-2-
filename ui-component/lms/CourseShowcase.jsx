import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Grid, Card, CardContent, Chip, Container, Divider, useTheme, LinearProgress } from '@mui/material';
import { School as SchoolIcon, PlayArrow as PlayIcon, CheckCircle as CompletedIcon, Schedule as InProgressIcon } from '@mui/icons-material';
import { useDataCache } from '../../contexts/DataCacheContext';
import { userDetails } from '../../utils/apiService';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CourseShowcase = ({ userType = 'guest', enrolledCourses = [] }) => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const { fetchData } = useDataCache();

  useEffect(() => {
    fetchFeaturedCourses();
  }, [userType]);

  const fetchFeaturedCourses = async () => {
    try {
      if (userType !== 'guest') {
        const accountId = userDetails.getAccountId();
        if (accountId) {
          // Use DataCacheContext pattern for consistent caching
          const result = await fetchData(`/api/lms/course/getAll/${accountId}`, {
            page: 0,
            size: 6,
            sortBy: 'id',
            sortDir: 'desc'
          });

          if (result.success && result.data) {
            setFeaturedCourses(result.data);
          } else {
            setFeaturedCourses(getMockCourses());
          }
        } else {
          setFeaturedCourses(getMockCourses());
        }
      } else {
        // Always use mock data for guests
        setFeaturedCourses(getMockCourses());
      }
    } catch (error) {
      console.error('Failed to fetch featured courses:', error);
      setFeaturedCourses(getMockCourses());
    } finally {
      setLoading(false);
    }
  };

  const getMockCourses = () => [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites',
      instructor: 'John Doe',
      rating: 4.8,
      students: 1200,
      price: 'Free',
      duration: '8 weeks'
    },
    {
      id: 2,
      title: 'Data Science Fundamentals',
      description: 'Explore data analysis, visualization, and machine learning concepts',
      instructor: 'Jane Smith',
      rating: 4.9,
      students: 850,
      price: '$99',
      duration: '12 weeks'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Learn modern digital marketing strategies and social media tactics',
      instructor: 'Mike Johnson',
      rating: 4.7,
      students: 600,
      price: '$79',
      duration: '6 weeks'
    }
  ];

  const EnrolledCourseCard = ({ course }) => {
    const progress = course.progress || 0;

    const getProgressIcon = () => {
      if (progress === 100) {
        return <CompletedIcon sx={{ color: theme.palette.success.main }} />;
      }
      return <InProgressIcon sx={{ color: theme.palette.warning.main }} />;
    };

    const getProgressColor = () => {
      if (progress === 100) return 'success';
      if (progress > 0) return 'warning';
      return 'info';
    };

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${theme.palette.primary.main}`,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: theme.palette.primary.main,
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          ENROLLED
        </Box>
        <CardContent sx={{ flexGrow: 1, pt: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography gutterBottom variant="h6" component="div">
              {course.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Instructor: {course.instructor || 'TBD'}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getProgressIcon()}
              <Typography variant="body2" sx={{ ml: 1 }}>
                Progress: {progress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} color={getProgressColor()} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip label={`${progress}% Complete`} color={getProgressColor()} variant="outlined" />
            <Chip label={course.duration || '8 weeks'} variant="outlined" />
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayIcon />}
            onClick={() => navigate(`/lms/course/${course.id}`)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    );
  };

  const RegularCourseCard = ({ course }) => {
    const isEnrolled = enrolledCourses.some((enrolled) => enrolled.id === course.id);

    if (isEnrolled) {
      return null; // Don't show enrolled courses in the regular section
    }

    const getCardActions = () => {
      if (userType === 'guest') {
        return (
          <Button variant="contained" fullWidth onClick={() => navigate(`/lms/course/${course.id}`)}>
            View Course
          </Button>
        );
      }

      return (
        <Button variant="contained" fullWidth onClick={() => navigate(`/lms/course/${course.id}`)}>
          Enroll Now
        </Button>
      );
    };

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              ⭐ {course.rating || 4.5}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({course.students || 0} students)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Instructor: {course.instructor || 'TBD'}
          </Typography>

          {/* Only show pricing for guest users */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {userType === 'guest' && <Chip label={course.price || 'Free'} color={course.price === 'Free' ? 'success' : 'primary'} />}
            <Chip label={course.duration || '8 weeks'} variant="outlined" />
          </Box>
          {getCardActions()}
        </CardContent>
      </Card>
    );
  };

  EnrolledCourseCard.propTypes = {
    course: PropTypes.object.isRequired
  };

  RegularCourseCard.propTypes = {
    course: PropTypes.object.isRequired
  };

  const getSectionTitle = () => {
    switch (userType) {
      case 'guest':
        return 'Featured Courses';
      case 'user':
        return 'Recommended for You';
      case 'enrolled':
        return 'Discover More Courses';
      default:
        return 'Featured Courses';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom textAlign="center">
          Loading Courses...
        </Typography>
      </Container>
    );
  }

  const filteredCourses = featuredCourses.filter((course) => !enrolledCourses.some((enrolled) => enrolled.id === course.id));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Show Enrolled Courses Section for enrolled users */}
      {userType === 'enrolled' && enrolledCourses.length > 0 && (
        <>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            My Enrolled Courses ({enrolledCourses.length})
          </Typography>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={`enrolled-${course.id}`}>
                <EnrolledCourseCard course={course} />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />
        </>
      )}

      {/* Show Other Courses Section */}
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        {getSectionTitle()}
      </Typography>
      <Grid container spacing={4}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <RegularCourseCard course={course} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" size="large" onClick={() => navigate('/lms/courses')}>
          View All Courses
        </Button>
      </Box>
    </Container>
  );
};

CourseShowcase.propTypes = {
  userType: PropTypes.oneOf(['guest', 'user', 'enrolled']),
  enrolledCourses: PropTypes.array
};

export default CourseShowcase;
