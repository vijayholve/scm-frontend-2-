import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  Certificate as CertificateIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // This would be your actual API call
      // const response = await api.get(`/api/lms/courses/${courseId}`);
      // For now, using mock data
      const mockCourse = {
        id: courseId,
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks. This comprehensive course will take you from beginner to building real-world projects.',
        longDescription: `
          This comprehensive web development course covers everything you need to know to start building modern websites and web applications. 
          
          You'll begin with the basics of HTML and CSS, learning how to structure and style web pages. Then we'll dive into JavaScript, 
          the programming language that brings websites to life. 
          
          Throughout the course, you'll work on hands-on projects that reinforce what you've learned and build a portfolio of work 
          to showcase to potential employers.
        `,
        instructor: {
          name: 'John Doe',
          title: 'Senior Web Developer',
          avatar: '/api/placeholder/64/64',
          experience: '8 years of experience',
          students: 5000,
          rating: 4.8
        },
        rating: 4.8,
        students: 1200,
        price: 'Free',
        originalPrice: '$199',
        duration: '8 weeks',
        level: 'Beginner',
        language: 'English',
        certificate: true,
        lastUpdated: '2024-01-15',
        modules: [
          {
            id: 1,
            title: 'Introduction to Web Development',
            lessons: [
              'What is Web Development?',
              'Setting up your development environment',
              'Overview of HTML, CSS, and JavaScript'
            ]
          },
          {
            id: 2,
            title: 'HTML Fundamentals',
            lessons: [
              'HTML Document Structure',
              'Common HTML Tags',
              'Forms and Input Elements',
              'Semantic HTML'
            ]
          },
          {
            id: 3,
            title: 'CSS Styling',
            lessons: [
              'CSS Selectors and Properties',
              'Layout with Flexbox and Grid',
              'Responsive Design',
              'CSS Animations'
            ]
          },
          {
            id: 4,
            title: 'JavaScript Basics',
            lessons: [
              'Variables and Data Types',
              'Functions and Control Flow',
              'DOM Manipulation',
              'Event Handling'
            ]
          }
        ],
        whatYouWillLearn: [
          'Build responsive websites from scratch',
          'Understand HTML, CSS, and JavaScript fundamentals',
          'Create interactive web applications',
          'Use modern development tools and techniques',
          'Deploy websites to the internet',
          'Best practices for web development'
        ],
        requirements: [
          'Basic computer skills',
          'Access to a computer with internet connection',
          'No prior programming experience required'
        ]
      };
      
      setCourse(mockCourse);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    setEnrollDialogOpen(true);
  };

  const handleEnrollSubmit = async () => {
    try {
      // Validate form data
      if (!enrollmentData.name || !enrollmentData.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // This would be your actual API call for enrollment
      // await api.post('/api/lms/enroll', { courseId, ...enrollmentData });
      
      toast.success('Enrollment request submitted! You will receive an email confirmation shortly.');
      setEnrollDialogOpen(false);
      setEnrollmentData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Failed to enroll:', error);
      toast.error('Failed to submit enrollment request');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading course details...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Course not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Navigation Header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/lms')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SCM LMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Course Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {course.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ color: '#ffd700', mr: 0.5 }} />
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {course.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({course.students} students)
                  </Typography>
                </Box>
                <Chip label={course.level} color="primary" variant="outlined" />
                <Chip label={course.language} color="secondary" variant="outlined" />
                {course.certificate && (
                  <Chip 
                    icon={<CertificateIcon />} 
                    label="Certificate" 
                    color="success" 
                    variant="outlined" 
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Course Description */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  About This Course
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {course.longDescription}
                </Typography>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  What You'll Learn
                </Typography>
                <Grid container>
                  {course.whatYouWillLearn.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <CheckIcon sx={{ color: 'success.main', mr: 1, mt: 0.5, fontSize: 20 }} />
                        <Typography variant="body2">{item}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Course Content
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.modules.length} modules • {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons
                </Typography>
                
                {course.modules.map((module) => (
                  <Box key={module.id} sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {module.title}
                    </Typography>
                    <List dense>
                      {module.lessons.map((lesson, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PlayIcon />
                          </ListItemIcon>
                          <ListItemText primary={lesson} />
                        </ListItem>
                      ))}
                    </List>
                    {module.id < course.modules.length && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Requirements
                </Typography>
                <List>
                  {course.requirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={req} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Enrollment Card */}
            <Card sx={{ position: 'sticky', top: 20, mb: 4 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {course.price}
                  </Typography>
                  {course.originalPrice && course.price === 'Free' && (
                    <Typography 
                      variant="body1" 
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      {course.originalPrice}
                    </Typography>
                  )}
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  sx={{ mb: 2 }}
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
                
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 3 }}>
                  30-day money-back guarantee
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TimeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={course.duration} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Language" 
                      secondary={course.language} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Students" 
                      secondary={course.students.toLocaleString()} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Instructor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ width: 56, height: 56, mr: 2 }}
                    src={course.instructor.avatar}
                  >
                    {course.instructor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {course.instructor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.title}
                    </Typography>
                  </Box>
                </Box>
                
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Experience" 
                      secondary={course.instructor.experience} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Students Taught" 
                      secondary={course.instructor.students.toLocaleString()} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Rating" 
                      secondary={`${course.instructor.rating}/5.0`} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Enrollment Dialog */}
      <Dialog open={enrollDialogOpen} onClose={() => setEnrollDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Please provide your details to enroll in "{course.title}"
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name *"
            fullWidth
            variant="outlined"
            value={enrollmentData.name}
            onChange={(e) => setEnrollmentData({ ...enrollmentData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email Address *"
            type="email"
            fullWidth
            variant="outlined"
            value={enrollmentData.email}
            onChange={(e) => setEnrollmentData({ ...enrollmentData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={enrollmentData.phone}
            onChange={(e) => setEnrollmentData({ ...enrollmentData, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEnrollSubmit} variant="contained">
            Submit Enrollment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseDetails;