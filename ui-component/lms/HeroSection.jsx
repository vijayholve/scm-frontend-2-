import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const DynamicHeroSection = ({ userType = 'guest' }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const getHeroContent = () => {
    switch (userType) {
      case 'guest':
        return {
          title: 'Learn Without Limits',
          subtitle: 'Discover thousands of courses and advance your skills with our comprehensive learning platform',
          primaryButton: { text: 'Explore Courses', action: () => navigate('/lms/courses') },
          secondaryButton: { text: 'Start Learning Today', action: () => navigate('/register') }
        };

      case 'user':
        return {
          title: 'Welcome Back!',
          subtitle: 'Continue your learning journey and discover new courses tailored just for you',
          primaryButton: { text: 'Browse Courses', action: () => navigate('/lms/courses') },
          secondaryButton: { text: 'View Dashboard', action: () => navigate('/dashboard') }
        };

      case 'enrolled':
        return {
          title: 'Continue Learning',
          subtitle: 'Pick up where you left off and keep progressing in your enrolled courses',
          primaryButton: { text: 'My Courses', action: () => navigate('/lms/my-courses') },
          secondaryButton: { text: 'Explore More', action: () => navigate('/lms/courses') }
        };

      default:
        return {
          title: 'Learn Without Limits',
          subtitle: 'Discover thousands of courses and advance your skills',
          primaryButton: { text: 'Explore Courses', action: () => navigate('/lms/courses') },
          secondaryButton: { text: 'Get Started', action: () => navigate('/register') }
        };
    }
  };

  const content = getHeroContent();

  return (
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
          {content.title}
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          {content.subtitle}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large" color="secondary" onClick={content.primaryButton.action}>
            {content.primaryButton.text}
          </Button>
          <Button variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white' }} onClick={content.secondaryButton.action}>
            {content.secondaryButton.text}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

DynamicHeroSection.propTypes = {
  userType: PropTypes.oneOf(['guest', 'user', 'enrolled'])
};

export default DynamicHeroSection;
