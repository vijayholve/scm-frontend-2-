
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Grid,
  Avatar,
  ListItemAvatar,
  Chip,
  Stack,
  Tooltip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../utils/apiService";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import StudentLmsDashboard from "views/dashboard/studentDashboard/StudentLmsDashboard";

// VideoRenderer: Simple video player for video lessons
const VideoRenderer = ({ url }) => {
  // Accepts YouTube and direct video links
  if (!url) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No video link provided.
      </Typography>
    );
  }
  // YouTube embed
  const ytMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
    );
  }
  // Direct video
  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <video width="100%" height="360" controls>
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

// DocumentRenderer: Simple document viewer (PDF, etc.)
const DocumentRenderer = ({ url }) => {
  if (!url) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No document link provided.
      </Typography>
    );
  }
  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <iframe
        src={url}
        title="Document"
        width="100%"
        height="500px"
        style={{ border: "none" }}
      />
    </Box>
  );
};

const CourseView = () => {
  // Expecting route: /course/:accountId/:courseId
  const { courseId } = useParams();
    const [expandedModules, setExpandedModules] = useState([]);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const user = useSelector(state => state.user.user?.data) || useSelector(state => state.user.user);
  const accountId = user?.accountId;
  const studentId = user?.id;
  const userType = user?.type;
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [progressByLessonId, setProgressByLessonId] = useState(new Set());
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedModules(isExpanded ? [panel] : []);
  };

  // Fetch course and enrolled students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course
        const courseRes = await api.get(
          `/api/lms/courses/${accountId}/${courseId}`
        );
        setCourse(courseRes.data);

        // Fetch enrolled students (API assumed, fallback to empty)
        try {
          const studentsRes = await api.post(
            `/api/lms/courses/${accountId}/${courseId}/enroll/${studentId}/status`,
            {
              accountId: accountId,
              courseId: courseId,
              studentId: studentId
            }
          );
          if( studentsRes.data == null || studentsRes.data == undefined || studentsRes.data == "") {
            setIsEnrolled(false);
          }
          else {
            setIsEnrolled(true);
          }
        } catch {
          setIsEnrolled(false);
        }

        // Fetch lesson progress for current student
        if (studentId) {
          try {
            
            const progRes = await api.get(
              `/api/lms/courses/${accountId}/${courseId}/progress/${studentId}`,
              { params: { accountId, courseId, studentId } }
            );
            if( progRes.data == null || progRes.data == undefined || progRes.data == "") {
              setProgressByLessonId(new Set());
            }
            else {
              const entries = Array.isArray(progRes.data) ? progRes.data : [];
              const completedIds = new Set(entries.filter(e => e.completed).map(e => e.lessonId));
              setProgressByLessonId(completedIds);
            }
          } catch {
            // fallback: derive from lesson.status in course payload if present
            const modulesFromCourse = courseRes.data?.modules || [];
            const allLessonsFromCourse = modulesFromCourse.flatMap(m => m.lessons || []);
            const completedIds = new Set(
              allLessonsFromCourse
                .filter(l => l.status === true || l.status === "true" || l.status === 1 || l.status === "1")
                .map(l => l.id)
            );
            setProgressByLessonId(completedIds);
          }
        }
        if(userType==="TEACHER" || userType==="ADMIN") {
          const studentsRes = await api.get(`/api/lms/courses/${accountId}/${courseId}/enrollments`);
          setStudents(studentsRes.data || []);
        }
      } catch {
        setCourse(null);
        setStudents([]);
        setIsEnrolled(false);
      }
      setLoading(false);
    };

    if (accountId && courseId) fetchData();
  }, [accountId, courseId, studentId]);

  // Calculate total modules, lessons, and completion percentage
  const modules = course?.modules || [];
  const totalModules = modules.length;
  const allLessons = modules.flatMap((mod) => mod.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = progressByLessonId.size > 0
    ? allLessons.filter((l) => progressByLessonId.has(l.id)).length
    : allLessons.filter(
        (l) =>
          l.status === true ||
          l.status === "true" ||
          l.status === 1 ||
          l.status === "1"
      ).length;
  const completionPercent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  // Handle lesson click
  const handleLessonClick = async (lesson,modId) => {
    console.log(lesson,modId);
    // Gate for students: must be enrolled
    if (userType === 'STUDENT' && !isEnrolled) {
      toast.error('Please enroll to preview this course.');
      return;
    }
    setSelectedLesson(lesson);
    // Auto mark as completed for current student
    if (studentId && lesson?.id) {
      try {
        await api.post('/api/lms/progress', {
          accountId,
          courseId: Number(courseId),
          moduleId: modId,
          lessonId: lesson.id,
          studentId,
          completed: true
        });
        setProgressByLessonId(prev => new Set(prev).add(lesson.id));
      } catch (e) {
        // Non-blocking
      }
    }
  };

  const handleEnrollNow = async () => {
    if (!studentId) return;
    setEnrollLoading(true);
    try {
      await api.post(`/api/lms/courses/${accountId}/${course.id}/enroll/${user.id}`, {
        accountId: accountId,
        courseId: course.id,
        studentId: user.id
      });
      setIsEnrolled(true);
      toast.success('Enrollment successful');
      // Refresh enrollments list
      try {
        const studentsRes = await api.get(`/api/lms/courses/${accountId}/${courseId}/enrollments`);
        setStudents(studentsRes.data || []);
      } catch {
        // ignore
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to enroll');
    }
    setEnrollLoading(false);
  };

  // Render right panel for selected lesson
  const renderLessonContent = () => {
    if (!selectedLesson) {
      return (
        <Paper
          sx={{
            p: 3,
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">
            Select a lesson to view its content.
          </Typography>
        </Paper>
      );
    }
    if (
      selectedLesson.type === "video" &&
      (selectedLesson.link || selectedLesson.url)
    ) {
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          <VideoRenderer url={selectedLesson.link || selectedLesson.url} />
          {selectedLesson.content && (
            <Typography sx={{ mt: 2 }}>{selectedLesson.content}</Typography>
          )}
        </Paper>
      );
    }
    if (
      selectedLesson.type === "document" &&
      (selectedLesson.documentId || selectedLesson.url)
    ) {

      console.log(selectedLesson);

      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          {selectedLesson.documentName && (
            <Typography sx={{ mb: 2 }}>{selectedLesson.documentName}</Typography>
          )}
          {selectedLesson.documentId && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
              <Typography>{selectedLesson.documentId}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  try {
                    // Call the document download API
                    // Adjust the API endpoint as per your backend
                    const response = await api.get(
                      `/api/documents/download/${accountId}/${selectedLesson.documentId}`,
                      { responseType: "blob" }
                    );
                    // Get filename from response headers or fallback
                    let filename = selectedLesson.documentName || "document";
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
                    // Optionally show error to user
                    alert("Failed to download document.");
                  }
                }}
              >
                Download Document
              </Button>
            </Box>
          )}
          {/* <DocumentRenderer url={selectedLesson.documentId || selectedLesson.url} /> */}
          {selectedLesson.content && (
            <Typography sx={{ mt: 2 }}>{selectedLesson.content}</Typography>
          )}
        </Paper>
      );
    }
    // Fallback for other types
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {selectedLesson.title}
        </Typography>
        <Typography>
          {selectedLesson.content ||
            selectedLesson.description ||
            "No content available for this lesson."}
        </Typography>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6 }}>
        <Typography color="error">Course not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200}}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            {course.description}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Chip label={`Modules: ${totalModules}`} color="primary" />
            <Chip label={`Lessons: ${totalLessons}`} color="secondary" />
            <Chip label={`Status: ${course.status || "N/A"}`} />
            <Chip label={`Enrolled: ${students.length}`} />
          </Stack>
        </Box>
        <Box sx={{ minWidth: 250, mt: { xs: 3, md: 0 } }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Completion: {completionPercent}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completionPercent}
            sx={{ height: 12, borderRadius: 2 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {completedLessons} of {totalLessons} lessons completed
          </Typography>
        </Box>
      </Paper>
              {/* <Grid item xs={12}> */}
                {/* <StudentLmsDashboard /> */}
            {/* </Grid> */}


      {userType === 'STUDENT' && !isEnrolled && (
        <>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Enrollment required</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            You must enroll to access this course content.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label={`Current enrollments: ${students.length}`} sx={{ mr: 2 }} />
            <Chip label={`Course ID: ${courseId}`} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <button
              onClick={handleEnrollNow}
              disabled={enrollLoading}
              style={{
                padding: '8px 16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: enrollLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </Box>
        </Paper>
              

        </>
      )}
 
      <Grid container spacing={3}>
        {/* Left: Modules & Lessons */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Modules & Lessons
            </Typography>
            {modules.length === 0 ? (
              <Typography color="text.secondary">
                No modules found for this course.
              </Typography>
            ) : (
        <List>
                {modules.map((mod, mIdx) => (
                  <Accordion
                    key={mod.id || mIdx} 
                    expanded={expandedModules.includes(mod.id)} 
                    onChange={handleAccordionChange(mod.id)}
                  >
                    <AccordionSummary
                      expandIcon={<GridExpandMoreIcon />}
                      aria-controls={`panel-${mod.id}-content`}
                      id={`panel-${mod.id}-header`}
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        '&.Mui-expanded': { borderBottom: 'none' },
                        bgcolor: 'background.paper',
                        margin: 0
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                          {mod.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          {mod.lessons.length} lessons
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List disablePadding>
                        {(mod.lessons || []).length === 0 ? (
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography color="text.secondary" fontSize={14}>
                                  No lessons
                                </Typography>
                              }
                            />
                          </ListItem>
                        ) : (
                          mod.lessons.map((lesson, lIdx) => {
                            const isCompleted = progressByLessonId.has(lesson.id) ||
                              lesson.status === true ||
                              lesson.status === "true" ||
                              lesson.status === 1 ||
                              lesson.status === "1";
                            return (
                              <ListItem
                                key={lesson.id || lIdx || mod.id || mIdx}
                                button
                                selected={
                                  selectedLesson && selectedLesson.id === lesson.id
                                }
                                onClick={() => handleLessonClick(lesson,mod.id)}
                                sx={{
                                  borderLeft: isCompleted
                                    ? "4px solid #4caf50"
                                    : "4px solid transparent",
                                  bgcolor:
                                    selectedLesson &&
                                    selectedLesson.id === lesson.id
                                      ? "action.selected"
                                      : "inherit",
                                  pointerEvents: (userType === 'STUDENT' && !isEnrolled) ? 'none' : 'auto',
                                  opacity: (userType === 'STUDENT' && !isEnrolled) ? 0.6 : 1
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Typography sx={{ fontWeight: 500, mr: 1 }}>
                                        {lesson.title}
                                      </Typography>
                                      <Chip
                                        size="small"
                                        label={lesson.type}
                                        color={
                                          lesson.type === "video"
                                            ? "primary"
                                            : lesson.type === "document"
                                            ? "secondary"
                                            : "default"
                                        }
                                        sx={{ ml: 1 }}
                                      />
                                      {isCompleted && (
                                        <Tooltip title="Completed">
                                          <Chip
                                            size="small"
                                            label="✓"
                                            color="success"
                                            sx={{ ml: 1 }}
                                          />
                                        </Tooltip>
                                      )}
                                      {userType === 'STUDENT' && !isEnrolled && (
                                        <Tooltip title="Enroll to access">
                                          <Chip size="small" label="Locked" sx={{ ml: 1 }} />
                                        </Tooltip>
                                      )}
                                    </Box>
                                  }
                                  secondary={lesson.content}
                                />
                              </ListItem>
                            );
                          })
                        )}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            )}
          </Paper>
          {/* Enrolled Students */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enrolled Students
            </Typography>
            {students.length === 0 ? (
              <Typography color="text.secondary">
                No students enrolled.
              </Typography>
            ) : (
              <List dense>
                {students.map((student, idx) => (
                  <ListItem key={student.id || idx}>
                    <ListItemAvatar>
                      <Avatar src={student.avatarUrl || undefined}>
                        {student.studentName ? student.studentName : "S"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.studentName || student.studentEmail || "Student"}
                      secondary={student.studentEmail}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        {/* Right: Lesson Content */}
        <Grid item xs={12} md={8}>
          {renderLessonContent()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseView;
