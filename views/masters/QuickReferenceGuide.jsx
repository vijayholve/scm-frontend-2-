import React from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Chip, useTheme } from '@mui/material';
import {
  School,
  People,
  Class,
  Subject,
  Groups,
  AccountBalance,
  CalendarToday,
  Schedule,
  LocalLibrary,
  Payment,
  DirectionsBus,
  Restaurant,
  PlayArrow
} from '@mui/icons-material';

const QuickReferenceGuide = () => {
  const theme = useTheme();

  const features = [
    {
      name: 'School Management',
      icon: <School />,
      purpose: 'Store school basic information',
      benefit: 'One place for all school details',
      usage: 'Add school name, address, contact info'
    },
    {
      name: 'Student Management',
      icon: <People />,
      purpose: 'Manage all student records',
      benefit: 'Track student information easily',
      usage: 'Register students, add personal details'
    },
    {
      name: 'Class Management',
      icon: <Class />,
      purpose: 'Create different grade levels',
      benefit: 'Organize students by grade',
      usage: 'Create classes like Grade 1, 2, 3...'
    },
    {
      name: 'Section Management',
      icon: <Groups />,
      purpose: 'Divide classes into smaller groups',
      benefit: 'Better classroom management',
      usage: 'Create sections A, B, C in each class'
    },
    {
      name: 'Subject Management',
      icon: <Subject />,
      purpose: 'Define what subjects are taught',
      benefit: 'Track curriculum and learning',
      usage: 'Add Math, Science, English etc.'
    },
    {
      name: 'Teacher Management',
      icon: <AccountBalance />,
      purpose: 'Manage teacher information',
      benefit: 'Track staff qualifications',
      usage: 'Add teacher details, assign subjects'
    },
    {
      name: 'Academic Year',
      icon: <CalendarToday />,
      purpose: 'Set school calendar and terms',
      benefit: 'Proper time management',
      usage: 'Define start/end dates, holidays'
    },
    {
      name: 'Timetable',
      icon: <Schedule />,
      purpose: 'Schedule classes and teachers',
      benefit: 'Avoid conflicts, organize time',
      usage: 'Assign subjects to time slots'
    },
    {
      name: 'Library',
      icon: <LocalLibrary />,
      purpose: 'Manage books and borrowing',
      benefit: 'Track books, prevent loss',
      usage: 'Add books, track who borrowed what'
    },
    {
      name: 'Fee Management',
      icon: <Payment />,
      purpose: 'Handle school fee collection',
      benefit: 'Track payments, reduce errors',
      usage: 'Set fee amounts, record payments'
    },
    {
      name: 'Transport',
      icon: <DirectionsBus />,
      purpose: 'Manage school bus system',
      benefit: 'Safe student transportation',
      usage: 'Create routes, assign students'
    },
    {
      name: 'Hostel',
      icon: <Restaurant />,
      purpose: 'Manage student accommodation',
      benefit: 'Organized hostel operations',
      usage: 'Allocate rooms, manage mess'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
        Quick Reference Guide
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Simple explanations of what each feature does and how to use it
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    mr: 2
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {feature.name}
                </Typography>
              </Box>

              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Chip label="What" size="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature.purpose} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Chip label="Why" size="small" color="success" />
                  </ListItemIcon>
                  <ListItemText primary={feature.benefit} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Chip label="How" size="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={feature.usage} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Setup Order Guide */}
      <Paper sx={{ mt: 6, p: 4, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Recommended Setup Order
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          For new schools, follow this order to set up your system properly:
        </Typography>
        <Grid container spacing={2}>
          {[
            { step: 1, feature: 'School Management', reason: 'Basic school information first' },
            { step: 2, feature: 'Academic Year', reason: 'Set up time periods' },
            { step: 3, feature: 'Classes & Sections', reason: 'Create student groups' },
            { step: 4, feature: 'Subjects', reason: 'Define what you teach' },
            { step: 5, feature: 'Teachers', reason: 'Add your staff' },
            { step: 6, feature: 'Students', reason: 'Register your students' }
          ].map((item) => (
            <Grid item xs={12} sm={6} key={item.step}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  {item.step}
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.feature}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {item.reason}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default QuickReferenceGuide;
