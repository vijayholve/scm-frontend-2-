import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  Groups as GroupsIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Book as BookIcon,
  Payment as PaymentIcon,
  LocalLibrary as LibraryIcon,
  DirectionsBus as BusIcon,
  Restaurant as RestaurantIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

const MasterFeatures = () => {
  const theme = useTheme();
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const masterFeatures = [
    {
      id: 'school',
      name: 'School Management',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      category: 'Institution',
      benefits: 'Centralized control of all school information and settings',
      description: "Manage your school's basic information, settings, and administrative details",
      howToUse: [
        'Go to Masters → School Management',
        'Add your school details (name, address, contact)',
        'Set academic year and session information',
        'Configure school policies and rules'
      ],
      keyFeatures: ['School profile management', 'Academic calendar setup', 'Contact information', 'School policies configuration']
    },
    {
      id: 'students',
      name: 'Student Management',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      category: 'People',
      benefits: 'Complete student information system with enrollment tracking',
      description: 'Manage all student records, admissions, and personal information',
      howToUse: [
        'Navigate to Masters → Students',
        'Click "Add New Student" button',
        'Fill in student personal and academic details',
        'Assign to appropriate class and section'
      ],
      keyFeatures: [
        'Student registration and enrollment',
        'Personal information management',
        'Academic history tracking',
        'Parent/guardian details'
      ]
    },
    {
      id: 'classes',
      name: 'Class Management',
      icon: <ClassIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
      category: 'Academic',
      benefits: 'Organized class structure for better academic management',
      description: 'Create and manage different classes, grades, and academic levels',
      howToUse: [
        'Go to Masters → Classes',
        'Create new class (e.g., Grade 1, Grade 2)',
        'Set class capacity and room assignment',
        'Assign class teacher if needed'
      ],
      keyFeatures: ['Grade/class creation', 'Class capacity management', 'Room assignment', 'Class teacher allocation']
    },
    {
      id: 'sections',
      name: 'Section Management',
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      category: 'Academic',
      benefits: 'Divide classes into manageable sections for better organization',
      description: 'Create sections within classes to organize students effectively',
      howToUse: ['Access Masters → Sections', 'Select a class first', 'Create sections (A, B, C, etc.)', 'Set section capacity limits'],
      keyFeatures: ['Section creation per class', 'Student capacity per section', 'Section naming flexibility', 'Easy student assignment']
    },
    {
      id: 'subjects',
      name: 'Subject Management',
      icon: <SubjectIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      category: 'Academic',
      benefits: 'Comprehensive curriculum management and subject tracking',
      description: 'Define and manage all subjects taught in your institution',
      howToUse: [
        'Navigate to Masters → Subjects',
        'Add new subjects with codes',
        'Assign subjects to specific classes',
        'Set subject categories (Core/Elective)'
      ],
      keyFeatures: ['Subject creation and coding', 'Class-wise subject assignment', 'Subject categorization', 'Curriculum mapping']
    },
    {
      id: 'teachers',
      name: 'Teacher Management',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
      category: 'People',
      benefits: 'Complete staff information system with qualification tracking',
      description: 'Manage teacher profiles, qualifications, and subject assignments',
      howToUse: [
        'Go to Masters → Teachers',
        'Add teacher personal information',
        'Upload qualifications and certificates',
        'Assign subjects and classes'
      ],
      keyFeatures: ['Teacher profile management', 'Qualification tracking', 'Subject assignment', 'Contact information']
    },
    {
      id: 'academic-year',
      name: 'Academic Year Setup',
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      category: 'Time Management',
      benefits: 'Proper academic calendar management for the entire institution',
      description: 'Set up academic years, terms, and important dates',
      howToUse: ['Access Masters → Academic Year', 'Create new academic year', 'Set start and end dates', 'Define terms/semesters'],
      keyFeatures: ['Academic year creation', 'Term/semester setup', 'Holiday calendar', 'Important dates marking']
    },
    {
      id: 'library',
      name: 'Library Management',
      icon: <LibraryIcon sx={{ fontSize: 40 }} />,
      color: '#795548',
      category: 'Resources',
      benefits: 'Digital library system for book tracking and student access',
      description: 'Manage library books, issue/return tracking, and student access',
      howToUse: [
        'Go to Masters → Library',
        'Add books to library catalog',
        'Set borrowing rules and limits',
        'Track book issues and returns'
      ],
      keyFeatures: ['Book catalog management', 'Issue/return tracking', 'Student borrowing limits', 'Overdue notifications']
    },
    {
      id: 'fees',
      name: 'Fee Management',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      category: 'Finance',
      benefits: 'Streamlined fee collection with automated calculations and tracking',
      description: 'Manage fee structures, collections, and financial tracking',
      howToUse: [
        'Access Masters → Fee Management',
        'Set up fee categories and amounts',
        'Create payment schedules',
        'Track fee collections and dues'
      ],
      keyFeatures: ['Fee structure setup', 'Payment tracking', 'Due date management', 'Receipt generation']
    }
  ];

  const categories = [...new Set(masterFeatures.map((feature) => feature.category))];

  const FeatureCard = ({ feature }) => (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: feature.color,
              width: 56,
              height: 56,
              mr: 2
            }}
          >
            {feature.icon}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {feature.name}
            </Typography>
            <Chip label={feature.category} size="small" sx={{ bgcolor: `${feature.color}20`, color: feature.color }} />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {feature.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Key Benefits:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {feature.benefits}
          </Typography>
        </Box>

        <Accordion
          expanded={expandedPanel === feature.id}
          onChange={handleChange(feature.id)}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              How to Use This Feature
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            <List dense>
              {feature.howToUse.map((step, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: feature.color,
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </ListItemIcon>
                  <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Alert for easy access */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          This documentation is accessible to all users without any special permissions. Use it as a reference guide while working with the
          system.
        </Typography>
      </Alert>

      {/* Category Navigation */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Feature Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={`${category} (${masterFeatures.filter((f) => f.category === category).length})`}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      </Box>

      {/* Features Grid */}
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            {category}
          </Typography>
          <Grid container spacing={3}>
            {masterFeatures
              .filter((feature) => feature.category === category)
              .map((feature) => (
                <Grid item xs={12} md={6} lg={4} key={feature.id}>
                  <FeatureCard feature={feature} />
                </Grid>
              ))}
          </Grid>
          {category !== categories[categories.length - 1] && <Divider sx={{ mt: 4 }} />}
        </Box>
      ))}

      {/* Getting Started Section */}
      <Box sx={{ mt: 8, p: 4, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          New to the system? Start with these essential masters in order:
        </Typography>
        <List>
          {[
            'Set up School Management first',
            'Create Academic Year and Terms',
            'Add Classes and Sections',
            'Register Subjects for each class',
            'Add Teachers and assign subjects',
            'Enroll Students into appropriate classes'
          ].map((step, index) => (
            <ListItem key={index} sx={{ color: 'white' }}>
              <ListItemIcon>
                <CheckIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MasterFeatures;
