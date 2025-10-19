import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Container,
  Stack,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayCircleOutline as PlayIcon,
  Description as DocumentIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Language as LanguageIcon,
  EmojiEvents as CertificateIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import api, { userDetails } from 'utils/apiService';
import VideoRenderer from './VideoRenderer';
import { useNavigate } from 'react-router-dom';

const CourseView = ({ courseId }) => {
  const user = useSelector((state) => state.user.user?.data) || useSelector((state) => state.user.user);
  const accountId = user?.accountId;
  const studentId = user?.id;
  const userType = user?.type;
  console.log('User Info:', { accountId, studentId, userType });
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [students, setStudents] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [progressByLessonId, setProgressByLessonId] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState([]);

  // Fetch course data
  const fetchCourseDataAndStatus = async () => {
    // Guest users (not logged in) can view the course page without accountId/studentId check
    if (!accountId && !studentId) return;
    setLoading(true);

    try {
      // 1. Fetch course details and its modules/lessons
      const courseRes = await api.get(`/api/lms/courses/${accountId || 10}/${courseId}`);
      const courseData = courseRes.data;

      // 2. Fetch enrollment status and student list (conditional on user type and login status)
      let enrolledStatus = false;
      let enrolledStudents = [];

      if (userType === 'STUDENT') {
        try {
          const statusRes = await api.post(`/api/lms/courses/${accountId}/${courseId}/enroll/${studentId}/status`, {
            accountId: accountId,
            courseId: courseId,
            studentId: studentId
          });
          console.log('Enrollment status response:', statusRes.data);
          if (studentsRes.data == null || studentsRes.data.length === 0) {
            // setIsEnrolled(false);
            enrolledStatus = false;
            cosnole.log('Enrollment status: false');
          } else {
            // setIsEnrolled(true);
            enrolledStatus = true;
            console.log('Enrollment status: true');
          }
          enrolledStatus = !!statusRes.data;
          console.log('Enrollment status:', enrolledStatus);
        } catch {
          enrolledStatus = false;
        }
      }

      // Admin/Teacher fetches list of enrolled students for view purposes
      if (userType === 'TEACHER' || userType === 'ADMIN') {
        try {
          const studentsRes = await api.get(`/api/lms/courses/${accountId}/${courseId}/enrollments`);
          enrolledStudents = studentsRes.data || [];
          enrolledStatus = true; // Always considered 'enrolled' for admin view
        } catch {
          enrolledStudents = [];
        }
      }

      setIsEnrolled(enrolledStatus);
      setStudents(enrolledStudents);

      // 3. Fetch lesson progress for current student
      // Only fetch progress if the user is logged in AND is a STUDENT AND enrolled
      if (userType === 'STUDENT' && studentId && enrolledStatus) {
        try {
          const progRes = await api.get(`/api/lms/courses/${accountId}/${courseId}/progress/${studentId}`);
          const entries = Array.isArray(progRes.data) ? progRes.data : [];
          const completedIds = new Set(entries.filter((e) => e.completed).map((e) => e.lessonId));
          setProgressByLessonId(completedIds);
        } catch {
          setProgressByLessonId(new Set());
        }
      } else {
        // Reset progress for not logged in users/Admin/Teacher
        setProgressByLessonId(new Set());
      }

      setCourse(courseData);

      // Initialize expanded modules - expand all modules by default
      if (courseData?.modules?.length > 0) {
        setExpandedModules(courseData.modules.map((mod) => mod.id));
      }
    } catch (err) {
      setCourse(null);
      toast.error('Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDataAndStatus();
  }, [accountId, courseId, studentId, userType]);

  // --- Handlers ---
  const handleEnrollNow = async () => {
    if (userType === 'STUDENT' && studentId && enrollLoading) return;
    setEnrollLoading(true);
    try {
      const payload = {
        accountId: accountId,
        courseId: Number(courseId),
        studentId: studentId
      };
      await api.post(`/api/lms/courses/${accountId}/${course.id}/enroll/${studentId}`, payload);
      setIsEnrolled(true);
      toast.success('Enrollment successful! You can now view the course content.');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to enroll in course.');
    }
    setEnrollLoading(false);
  };

  const handleLessonClick = async (lesson, modId) => {
    // Content Access Policy:
    // 1. Not logged in (GUEST): No access to lesson content
    // 2. ADMIN, TEACHER (logged in): Always have access
    // 3. STUDENT (logged in, not enrolled): No access, show toast
    // 4. STUDENT (logged in, enrolled): Full access

    if (userType === 'STUDENT' && !isEnrolled) {
      toast.error('Please enroll to access lesson content.');
      setSelectedLesson(null);
      return;
    }

    setSelectedLesson(lesson);
    setSelectedModuleId(modId);

    // Only mark as complete if it's a logged-in, enrolled STUDENT
    if (userType === 'STUDENT' && studentId && lesson?.id && isEnrolled) {
      try {
        await api.post('/api/lms/progress', {
          accountId,
          courseId: Number(courseId),
          moduleId: modId,
          lessonId: lesson.id,
          studentId,
          completed: true
        });
        setProgressByLessonId((prev) => new Set(prev).add(lesson.id));
      } catch (e) {
        // Fail silently
      }
    }
  };

  const handleAccordionChange = (moduleId) => (event, isExpanded) => {
    if (isExpanded) {
      setExpandedModules((prev) => [...prev, moduleId]);
    } else {
      setExpandedModules((prev) => prev.filter((id) => id !== moduleId));
    }
  };

  const getLessonIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <PlayIcon />;
      case 'document':
      case 'reading':
        return <DocumentIcon />;
      case 'quiz':
      case 'assessment':
        return <QuizIcon />;
      default:
        return <DocumentIcon />;
    }
  };

  const renderLessonContent = () => {
    if (!selectedLesson) {
      return (
        <Paper
          sx={{
            p: 3,
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography>Select a lesson to view its content.</Typography>
        </Paper>
      );
    }

    if (selectedLesson.type === 'video' && (selectedLesson.link || selectedLesson.url)) {
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          <VideoRenderer url={selectedLesson.link || selectedLesson.url} />
          {selectedLesson.content && <Typography sx={{ mt: 2 }}>{selectedLesson.content}</Typography>}
        </Paper>
      );
    }

    if (selectedLesson.type === 'document' && (selectedLesson.documentId || selectedLesson.url)) {
      console.log(selectedLesson);

      return (
        <Paper
          sx={{
            p: 3,
            maxHeight: '80vh',
            overflowY: 'auto',
            width: '100%'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          {selectedLesson.documentName && <Typography sx={{ mb: 2 }}>{selectedLesson.documentName}</Typography>}
          {selectedLesson.documentId && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography>{selectedLesson.documentId}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  try {
                    // Call the document download API
                    const response = await api.get(`/api/documents/download/${accountId}/${selectedLesson.documentId}`, {
                      responseType: 'blob'
                    });
                    // Get filename from response headers or fallback
                    let filename = selectedLesson.documentName || 'document';
                    const disposition = response.headers['content-disposition'];
                    if (disposition && disposition.indexOf('filename=') !== -1) {
                      const match = disposition.match(/filename="?([^"]+)"?/);
                      if (match && match[1]) filename = match[1];
                    }
                    // Create a blob and trigger download
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    toast.error('Failed to download document.');
                  }
                }}
              >
                Download Document
              </Button>
            </Box>
          )}
          {selectedLesson.content && <Typography sx={{ mt: 2 }}>{selectedLesson.content}</Typography>}
        </Paper>
      );
    }

    // Fallback for other types
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedLesson.title}
        </Typography>
        <Typography>{selectedLesson.content || selectedLesson.description || 'No content available for this lesson.'}</Typography>
      </Paper>
    );
  };

  const modules = course?.modules || [];
  const totalModules = modules.length;
  const allLessons = modules.flatMap((mod) => mod.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => progressByLessonId.has(l.id)).length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // --- Render ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Course not found or failed to load.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Side - Course Content */}
          <Grid item xs={12} lg={8}>
            {/* Hero Section */}
            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              {/* <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          <VideoRenderer url={selectedLesson.link || selectedLesson.url} />
          {selectedLesson.content && <Typography sx={{ mt: 2 }}>{selectedLesson.content}</Typography>}
        </Paper> */}
              {allLessons.length > 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {allLessons[0].title} Preview
                  </Typography>
                  {/* Decreased video player size */}
                  <Box sx={{ maxWidth: 720, mx: 'auto', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <VideoRenderer url={allLessons[0].link || allLessons[0].url} />
                  </Box>
                  {allLessons[0].content && <Typography sx={{ mt: 2 }}>{allLessons[0].content}</Typography>}
                </Paper>
              )}
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={course.category || 'Web Development'} color="primary" size="small" />
                  <Chip label="Bestseller" color="warning" size="small" />
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  {course.title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  {course.description}
                </Typography>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
                    <Typography variant="body1" fontWeight="bold">
                      4.6
                    </Typography>
                    <Typography variant="body2">(2,847 ratings)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">11,604 students</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                  What you'll learn
                </Typography>
                <Grid container spacing={2}>
                  {[
                    'Build responsive websites from scratch using modern technologies',
                    'Master React, Node.js, and database integration',
                    'Understand modern development workflows and best practices',
                    'Deploy applications to production environments'
                  ].map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <CheckIcon sx={{ color: '#22c55e', mt: 0.5, fontSize: 20 }} />
                        <Typography variant="body1">{item}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold">
                    Course content
                  </Typography>
                  <Button variant="text" size="small">
                    Expand all sections
                  </Button>
                </Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {totalModules} sections • {totalLessons} lectures • 21h 48m total length
                </Typography>

                {modules.map((module, index) => (
                  <Accordion
                    key={module.id}
                    expanded={expandedModules.includes(module.id)}
                    onChange={handleAccordionChange(module.id)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,

                      boxShadow: 'none',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        // bgcolor: '#f8fafc',
                        borderRadius: 2
                        // '&.Mui-expanded': { borderRadius: '8px 8px 0 0' }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="600">
                          {module.title}
                        </Typography>
                        <Typography variant="body2">{module.lessons?.length || 0} lectures • 77min</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List disablePadding>
                        {(module.lessons || []).map((lesson, lessonIndex) => {
                          const isCompleted = progressByLessonId.has(lesson.id);
                          const isLocked = userType === 'STUDENT' && !isEnrolled;

                          return (
                            <ListItem
                              key={lesson.id}
                              button
                              onClick={() => handleLessonClick(lesson, module.id)}
                              selected={selectedLesson?.id === lesson.id}
                              sx={{
                                py: 2,
                                px: 3,
                                borderBottom: lessonIndex < module.lessons.length - 1 ? '1px solid #e2e8f0' : 'none'
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 40, color: isLocked ? '#94a3b8' : isCompleted ? '#22c55e' : '#64748b' }}>
                                {isCompleted ? (
                                  <CheckIcon sx={{ color: '#22c55e' }} />
                                ) : isLocked ? (
                                  <LockIcon sx={{ color: '#94a3b8' }} />
                                ) : (
                                  getLessonIcon(lesson.type)
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={lesson.title}
                                secondary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                    <Typography variant="caption">{lesson.type || 'Lesson'}</Typography>
                                    <Typography variant="caption">• 10min</Typography>
                                    {isCompleted && <Chip label="Completed" size="small" color="success" />}
                                    {isLocked && <Chip label="Preview" size="small" variant="outlined" />}
                                  </Box>
                                }
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>

            {/* Lesson Content Viewer */}
            {renderLessonContent()}
          </Grid>

          {/* Right Side - Course Info & Purchase */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              {/* Purchase Card */}
              <Card sx={{ mb: 3, borderRadius: 3, border: '2px solid #e2e8f0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      ₹788
                    </Typography>
                    <Typography variant="h6" sx={{ textDecoration: 'line-through' }}>
                      ₹2069
                    </Typography>
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                      62% off
                    </Typography>
                  </Box>

                  {!isEnrolled ? (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleEnrollNow}
                      disabled={enrollLoading}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        mb: 2
                      }}
                    >
                      {enrollLoading ? <CircularProgress size={24} /> : 'Enroll Now'}
                    </Button>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ mb: 1 }}>
                        ✓ Enrolled
                      </Typography>
                      <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {Math.round(progressPercentage)}% complete
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2 }}
                    onClick={() => {
                      // if (isEnrolled) {
                      navigate('/masters/lms/course/view/' + courseId);
                      // }
                    }}
                  >
                    View course
                  </Button>

                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                    30-Day Money-Back Guarantee
                  </Typography>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    This course includes:
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PlayIcon sx={{ fontSize: 20 }} />
                      <Typography variant="body2">21.5 hours on-demand video</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DocumentIcon sx={{ fontSize: 20 }} />
                      <Typography variant="body2">146 downloadable resources</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LanguageIcon sx={{ fontSize: 20 }} />
                      <Typography variant="body2">Access on mobile and TV</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CertificateIcon sx={{ fontSize: 20 }} />
                      <Typography variant="body2">Certificate of completion</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Instructor
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar src="/api/placeholder/60/60" sx={{ width: 60, height: 60 }} />
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {course.instructor || 'John Doe'}
                      </Typography>
                      <Typography variant="body2">Full Stack Developer</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                        <Typography variant="caption">4.6 Instructor Rating</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseView;
