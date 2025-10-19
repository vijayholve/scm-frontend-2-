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

const CourseCard = ({ title, description, level, duration }) => (
    <Card 
        elevation={6} 
        sx={{ 
            bgcolor: '#1e1e1e', // Dark background inspired by user's image
            color: 'white',
            borderRadius: 3, 
            overflow: 'hidden', 
            transition: 'transform 0.3s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': { transform: 'scale(1.02)', boxShadow: 10 }
        }}
    >
        <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                    label={level}
                    size="small"
                    sx={{ 
                        fontWeight: 'bold', 
                        bgcolor: level === 'Beginner' ? '#4caf50' : level === 'Intermediate' ? '#ffeb3b' : '#f44336', 
                        color: level === 'Intermediate' ? '#333' : 'white'
                    }}
                />
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#bdbdbd' }}>
                    <BookIcon sx={{ fontSize: 16, mr: 0.5 }} /> {duration}
                </Typography>
            </Box>
            <Typography variant="h6" component="h4" sx={{ fontWeight: 'bold', mb: 1, minHeight: 60 }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {description}
            </Typography>
            <Button 
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                    mt: 'auto', // Push to bottom
                    color: PRIMARY_COLOR, 
                    borderColor: PRIMARY_COLOR, 
                    bgcolor: 'white', 
                    fontWeight: 'bold',
                    '&:hover': { 
                        bgcolor: PRIMARY_COLOR, 
                        color: 'white' 
                    }
                }}
            >
                View Path Details
            </Button>
        </CardContent>
    </Card>
);

export default CourseCard;