import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  useTheme
} from '@mui/material';
import {
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebIcon,
  Star as StarIcon,
  People as PeopleIcon,
  MenuBook as BookIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LMSAbout = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const stats = [
    { icon: <BookIcon sx={{ fontSize: 40 }} />, label: 'Courses Available', value: '150+', color: theme.palette.primary.main },
    { icon: <PeopleIcon sx={{ fontSize: 40 }} />, label: 'Active Students', value: '5,000+', color: theme.palette.success.main },
    { icon: <StarIcon sx={{ fontSize: 40 }} />, label: 'Expert Instructors', value: '50+', color: theme.palette.warning.main },
    { icon: <TrophyIcon sx={{ fontSize: 40 }} />, label: 'Certificates Issued', value: '2,500+', color: theme.palette.info.main }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Director of Education',
      image: '/api/placeholder/150/150',
      bio: 'With over 15 years in educational technology, Dr. Johnson leads our curriculum development and ensures the highest quality of learning experiences.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Technology',
      image: '/api/placeholder/150/150',
      bio: 'Michael oversees our platform development and ensures our LMS stays at the cutting edge of educational technology.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student Success Manager',
      image: '/api/placeholder/150/150',
      bio: 'Emily works closely with students to ensure they achieve their learning goals and have the support they need to succeed.'
    },
    {
      name: 'David Kim',
      role: 'Content Specialist',
      image: '/api/placeholder/150/150',
      bio: 'David collaborates with instructors to create engaging, interactive content that makes learning both effective and enjoyable.'
    }
  ];

  const values = [
    {
      title: 'Quality Education',
      description: 'We believe everyone deserves access to high-quality education that can transform their lives and careers.',
      icon: <SchoolIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
    },
    {
      title: 'Accessibility',
      description: 'Our platform is designed to be accessible to learners of all backgrounds, abilities, and circumstances.',
      icon: <PeopleIcon sx={{ fontSize: 50, color: theme.palette.success.main }} />
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate our teaching methods and technology to provide the best learning experience.',
      icon: <StarIcon sx={{ fontSize: 50, color: theme.palette.warning.main }} />
    },
    {
      title: 'Community',
      description: 'We foster a supportive community where learners can connect, collaborate, and grow together.',
      icon: <TrophyIcon sx={{ fontSize: 50, color: theme.palette.info.main }} />
    }
  ];

  const StatCard = ({ stat }) => (
    <Card sx={{ textAlign: 'center', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ color: stat.color, mb: 2 }}>
          {stat.icon}
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {stat.value}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  );

  const TeamCard = ({ member }) => (
    <Card sx={{ textAlign: 'center', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Avatar
          src={member.image}
          sx={{ 
            width: 120, 
            height: 120, 
            mx: 'auto', 
            mb: 2,
            border: `3px solid ${theme.palette.primary.main}`
          }}
        >
          {member.name.charAt(0)}
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {member.name}
        </Typography>
        <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
          {member.role}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {member.bio}
        </Typography>
      </CardContent>
    </Card>
  );

  const ValueCard = ({ value }) => (
    <Card sx={{ height: '100%', p: 3 }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {value.icon}
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          {value.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          {value.description}
        </Typography>
      </CardContent>
    </Card>
  );

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
            About SCM LMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
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
            About Our Learning Platform
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Empowering learners worldwide with accessible, high-quality education
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Mission Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
            To democratize education by providing accessible, high-quality learning experiences that empower individuals 
            to achieve their personal and professional goals, regardless of their background or circumstances.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard stat={stat} />
            </Grid>
          ))}
        </Grid>

        {/* Story Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center">
            Our Story
          </Typography>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                Founded in 2020, SCM Learning Management System emerged from a simple belief: everyone deserves 
                access to quality education. What started as a small initiative to provide online courses during 
                the pandemic has grown into a comprehensive learning platform serving thousands of students worldwide.
              </Typography>
              <Typography variant="body1" paragraph>
                Our platform was built with the understanding that traditional education doesn't work for everyone. 
                Whether you're a working professional looking to upskill, a student seeking supplementary learning, 
                or someone exploring a new career path, we provide flexible, engaging courses that fit your schedule and learning style.
              </Typography>
              <Typography variant="body1" paragraph>
                Today, we partner with industry experts and experienced educators to deliver courses that are not only 
                academically rigorous but also practically relevant. Our commitment to innovation means we're constantly 
                updating our platform and course offerings to meet the evolving needs of our learners.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  backgroundColor: theme.palette.grey[200],
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SchoolIcon sx={{ fontSize: 120, color: theme.palette.grey[400] }} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <ValueCard value={value} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 6 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <TeamCard member={member} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: theme.palette.grey[50] }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Have questions about our platform or courses? We'd love to hear from you!
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography variant="body1">info@scmlms.com</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography variant="body1">+1 (555) 123-4567</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WebIcon color="primary" />
                <Typography variant="body1">www.scmlms.com</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Join Our Platform
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/lms/courses')}
            >
              Browse Courses
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LMSAbout;