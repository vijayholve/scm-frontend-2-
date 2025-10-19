import React from 'react';
// Importing core MUI components and icons
import { 
  AppBar, Toolbar, Typography, Button, Box, Grid, Card, CardContent, Chip, Container, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Used for course book/open
import BoltIcon from '@mui/icons-material/Bolt';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookIcon from '@mui/icons-material/Book'; // Used for course duration

const PRIMARY_COLOR = '#3f51b5'; // Deep Indigo/Blue for Professional look

const ValueProposition = () => {
    const features = [
        { icon: AutoStoriesIcon, title: 'Modular Curriculum', description: 'Bite-sized, practical lessons covering every koolERP module from basic navigation to advanced configuration.' },
        { icon: BoltIcon, title: 'Hands-On Practice', description: 'Access to live sandbox environments to practice system configurations and real-world transactions immediately.' },
        { icon: PeopleIcon, title: 'Accredited Experts', description: 'Train with certified instructors who have years of experience implementing and managing koolERP globally.' },
    ];

    return (
        <Box id="certifications" sx={{  py: { xs: 10, md: 16 } }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: 'bold', mb: 8 }}>
                    Structured Learning for Real Results
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                elevation={6} 
                                sx={{ 
                                    p: 4, 
                                    textAlign: 'center', 
                                    borderRadius: 3, 
                                    borderBottom: `5px solid ${PRIMARY_COLOR}`,
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 }
                                }}
                            >
                                <Box sx={{ bgcolor: 'secondary.light', p: 2, borderRadius: '50%', display: 'inline-flex', mb: 3 }}>
                                    <feature.icon sx={{ fontSize: 40, color: PRIMARY_COLOR }} />
                                </Box>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ValueProposition;