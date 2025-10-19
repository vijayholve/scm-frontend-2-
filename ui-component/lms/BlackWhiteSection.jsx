import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, useTheme } from '@mui/material';
import { PlayCircleOutline, School, TrendingUp, People } from '@mui/icons-material';
import { useLMSTheme } from '../../contexts/LMSThemeContext';

const BlackWhiteSection = ({ 
  variant = 'black', // 'black' or 'white'
  title,
  subtitle,
  description,
  buttonText,
  onButtonClick,
  features = [],
  customContent,
  userType = 'guest'
}) => {
  const theme = useTheme();
  const { isDarkMode } = useLMSTheme();
  
  // Determine if this section should be "dark" based on variant and current theme
  const shouldBeDark = variant === 'black';
  
  const sectionStyles = {
    backgroundColor: shouldBeDark 
      ? (isDarkMode ? '#1a1a1a' : '#000000')
      : (isDarkMode ? '#000000' : '#ffffff'),
    color: shouldBeDark 
      ? '#ffffff'
      : theme.palette.text.primary,
    py: 8,
    position: 'relative',
    overflow: 'hidden'
  };

  const defaultFeatures = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of experience'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Community Support',
      description: 'Connect with fellow learners and instructors'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  const getDefaultContent = () => {
    if (shouldBeDark) {
      return {
        title: userType === 'enrolled' ? 'Continue Your Learning Journey' : 'Transform Your Career Today',
        subtitle: 'Premium Learning Experience',
        description: userType === 'enrolled' 
          ? 'Pick up where you left off and master new skills with our comprehensive course library.'
          : 'Join thousands of learners who have advanced their careers through our expertly crafted courses.',
        buttonText: userType === 'enrolled' ? 'Continue Learning' : 'Start Learning Now'
      };
    } else {
      return {
        title: 'Why Choose Our Platform?',
        subtitle: 'Built for Modern Learners',
        description: 'Our cutting-edge learning management system is designed to provide the best educational experience with innovative features and tools.',
        buttonText: 'Explore Features'
      };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    subtitle: subtitle || getDefaultContent().subtitle,
    description: description || getDefaultContent().description,
    buttonText: buttonText || getDefaultContent().buttonText
  };

  const textColor = shouldBeDark ? '#ffffff' : theme.palette.text.primary;
  const secondaryTextColor = shouldBeDark 
    ? 'rgba(255,255,255,0.8)' 
    : theme.palette.text.secondary;

  return (
    <Box sx={sectionStyles}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: shouldBeDark 
            ? 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)'
            : `radial-gradient(circle at 25% 25%, ${theme.palette.text.primary} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {customContent || (
          <>
            {/* Main Content */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: shouldBeDark ? theme.palette.primary.light : theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: 2,
                  mb: 2,
                  display: 'block'
                }}
              >
                {content.subtitle}
              </Typography>
              
              <Typography 
                variant="h2" 
                component="h2"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  color: textColor
                }}
              >
                {content.title}
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  color: secondaryTextColor,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                {content.description}
              </Typography>
              
              {onButtonClick && (
                <Button
                  variant={shouldBeDark ? 'contained' : 'outlined'}
                  size="large"
                  onClick={onButtonClick}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    ...(shouldBeDark ? {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    } : {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white'
                      }
                    })
                  }}
                  startIcon={<PlayCircleOutline />}
                >
                  {content.buttonText}
                </Button>
              )}
            </Box>

            {/* Features Grid */}
            {displayFeatures.length > 0 && (
              <Grid container spacing={4} sx={{ mt: 4 }}>
                {displayFeatures.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: shouldBeDark 
                          ? 'rgba(255,255,255,0.05)'
                          : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                        border: `1px solid ${shouldBeDark 
                          ? 'rgba(255,255,255,0.1)' 
                          : theme.palette.divider}`,
                        color: textColor,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: shouldBeDark 
                            ? 'rgba(255,255,255,0.1)'
                            : theme.palette.action.hover,
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          color: shouldBeDark ? theme.palette.primary.light : theme.palette.primary.main,
                          mb: 2 
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          color: textColor
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: secondaryTextColor,
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default BlackWhiteSection;
