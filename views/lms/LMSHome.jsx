import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as CourseIcon,
  People as StudentsIcon,
  Star as StarIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/apiService';

const LMSHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0
  });

  useEffect(() => {
    // Fetch featured courses and stats
    fetchFeaturedCourses();
    fetchStats();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      // This would be your actual API call
      // const response = await api.get('/api/lms/featured-courses');
      // For now, using mock data
      setFeaturedCourses([
        {
          id: 1,
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          image: '/api/placeholder/300/200',
          instructor: 'John Doe',
          rating: 4.8,
          students: 1200,
          price: 'Free',
          duration: '8 weeks'
        },
        {
          id: 2,
          title: 'Data Science Fundamentals',
          description: 'Explore data analysis, visualization, and machine learning',
          image: '/api/placeholder/300/200',
          instructor: 'Jane Smith',
          rating: 4.9,
          students: 850,
          price: '$99',
          duration: '12 weeks'
        },
        {
          id: 3,
          title: 'Digital Marketing Mastery',
          description: 'Learn modern digital marketing strategies and tools',
          image: '/api/placeholder/300/200',
          instructor: 'Mike Johnson',
          rating: 4.7,
          students: 600,
          price: '$79',
          duration: '6 weeks'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch featured courses:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // This would be your actual API call
      // const response = await api.get('/api/lms/stats');
      // For now, using mock data
      setStats({
        totalCourses: 150,
        totalStudents: 5000,
        totalInstructors: 50
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ textAlign: 'center', p: 2 }}>
      <CardContent>
        <Box sx={{ color: color, mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const CourseCard = ({ course }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundColor: theme.palette.grey[300],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CourseIcon sx={{ fontSize: 60, color: theme.palette.grey[500] }} />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StarIcon sx={{ color: '#ffd700', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" sx={{ mr: 1 }}>
            {course.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({course.students} students)
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Instructor: {course.instructor}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip label={course.price} color={course.price === 'Free' ? 'success' : 'primary'} />
          <Chip label={course.duration} variant="outlined" />
        </Box>
        <Button 
          variant="contained" 
          fullWidth
          onClick={() => navigate(`/lms/course/${course.id}`)}
        >
          View Course
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SCM Learning Management System
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/lms/courses'); handleMenuClose(); }}>
                  Courses
                </MenuItem>
                <MenuItem onClick={() => { navigate('/lms/about'); handleMenuClose(); }}>
                  About
                </MenuItem>
                <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
                  Login
                </MenuItem>
                <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>
                  Register
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/lms/courses')}>
                Courses
              </Button>
              <Button color="inherit" onClick={() => navigate('/lms/about')}>
                About
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<RegisterIcon />}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Learn Without Limits
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Discover thousands of courses and advance your skills with our comprehensive learning platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              color="secondary"
              onClick={() => navigate('/lms/courses')}
            >
              Explore Courses
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ borderColor: 'white', color: 'white' }}
              onClick={() => navigate('/register')}
            >
              Start Learning Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<CourseIcon sx={{ fontSize: 40 }} />}
              title="Available Courses"
              value={stats.totalCourses}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<StudentsIcon sx={{ fontSize: 40 }} />}
              title="Active Students"
              value={stats.totalStudents}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Expert Instructors"
              value={stats.totalInstructors}
              color={theme.palette.info.main}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Featured Courses
        </Typography>
        <Grid container spacing={4}>
          {featuredCourses.map((course) => (
            <Grid item xs={12} md={4} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/lms/courses')}
          >
            View All Courses
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[100], py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Join thousands of students and start your learning journey today
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/register')}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LMSHome;