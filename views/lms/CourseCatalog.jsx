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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useTheme
} from '@mui/material';
import {
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Star as StarIcon,
  MenuBook as CourseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CourseCatalog = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  const categories = [
    'Web Development',
    'Data Science',
    'Digital Marketing',
    'Design',
    'Business',
    'Programming',
    'Photography',
    'Music'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceOptions = ['Free', 'Paid', 'Premium'];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, categoryFilter, levelFilter, priceFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // This would be your actual API call
      // const response = await api.get('/api/lms/courses');
      // For now, using mock data
      const mockCourses = [
        {
          id: 1,
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          category: 'Web Development',
          level: 'Beginner',
          instructor: 'John Doe',
          rating: 4.8,
          students: 1200,
          price: 'Free',
          originalPrice: '$99',
          duration: '8 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 2,
          title: 'Advanced React Development',
          description: 'Master React with hooks, context, and advanced patterns',
          category: 'Web Development',
          level: 'Advanced',
          instructor: 'Jane Smith',
          rating: 4.9,
          students: 850,
          price: '$149',
          duration: '12 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 3,
          title: 'Data Science Fundamentals',
          description: 'Explore data analysis, visualization, and machine learning',
          category: 'Data Science',
          level: 'Intermediate',
          instructor: 'Mike Johnson',
          rating: 4.7,
          students: 600,
          price: '$99',
          duration: '10 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 4,
          title: 'Digital Marketing Mastery',
          description: 'Learn modern digital marketing strategies and tools',
          category: 'Digital Marketing',
          level: 'Beginner',
          instructor: 'Sarah Wilson',
          rating: 4.6,
          students: 400,
          price: '$79',
          duration: '6 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 5,
          title: 'UI/UX Design Principles',
          description: 'Create beautiful and user-friendly interfaces',
          category: 'Design',
          level: 'Beginner',
          instructor: 'Alex Chen',
          rating: 4.8,
          students: 750,
          price: 'Free',
          originalPrice: '$129',
          duration: '8 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 6,
          title: 'Python for Beginners',
          description: 'Start your programming journey with Python',
          category: 'Programming',
          level: 'Beginner',
          instructor: 'David Brown',
          rating: 4.9,
          students: 1500,
          price: 'Free',
          duration: '6 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 7,
          title: 'Business Strategy and Planning',
          description: 'Develop effective business strategies for growth',
          category: 'Business',
          level: 'Intermediate',
          instructor: 'Lisa Garcia',
          rating: 4.5,
          students: 300,
          price: '$199',
          duration: '10 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 8,
          title: 'Photography Masterclass',
          description: 'Capture stunning photos with professional techniques',
          category: 'Photography',
          level: 'Intermediate',
          instructor: 'Tom Anderson',
          rating: 4.7,
          students: 500,
          price: '$89',
          duration: '8 weeks',
          image: '/api/placeholder/300/200'
        },
        {
          id: 9,
          title: 'Music Production Basics',
          description: 'Create your own music with digital audio workstations',
          category: 'Music',
          level: 'Beginner',
          instructor: 'Emma Davis',
          rating: 4.6,
          students: 200,
          price: '$119',
          duration: '12 weeks',
          image: '/api/placeholder/300/200'
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'Free') {
        filtered = filtered.filter(course => course.price === 'Free');
      } else if (priceFilter === 'Paid') {
        filtered = filtered.filter(course => course.price !== 'Free' && !course.price.includes('$199'));
      } else if (priceFilter === 'Premium') {
        filtered = filtered.filter(course => course.price.includes('$199') || parseInt(course.price.replace('$', '')) >= 150);
      }
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
        <Chip 
          label={course.category} 
          size="small" 
          color="primary" 
          variant="outlined" 
          sx={{ mb: 1 }} 
        />
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
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              {course.price}
            </Typography>
            {course.originalPrice && course.price === 'Free' && (
              <Typography 
                variant="body2" 
                sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
              >
                {course.originalPrice}
              </Typography>
            )}
          </Box>
          <Chip label={course.level} size="small" />
        </Box>
        <Button 
          variant="contained" 
          fullWidth
          onClick={() => navigate(`/lms/course/${course.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading courses...</Typography>
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
            Course Catalog
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Explore Our Courses
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Discover new skills and advance your career with our expert-led courses
        </Typography>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    label="Level"
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Price</InputLabel>
                  <Select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    label="Price"
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    {priceOptions.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Showing {paginatedCourses.length} of {filteredCourses.length} courses
        </Typography>

        {/* Course Grid */}
        {paginatedCourses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No courses found matching your criteria
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setLevelFilter('all');
                setPriceFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {paginatedCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default CourseCatalog;