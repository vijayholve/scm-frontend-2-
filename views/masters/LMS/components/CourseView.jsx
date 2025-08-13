
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
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../utils/apiService";
import { useSelector } from "react-redux";

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
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const user = useSelector(state => state.user);

  // Fetch course and enrolled students
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course
        const courseRes = await api.get(
          `/api/lms/courses/${user?.user?.accountId}/${courseId}`
        );
        setCourse(courseRes.data);

        // Fetch enrolled students (API assumed, fallback to empty)
        let studentsRes;
        try {
          studentsRes = await api.get(
            `/api/lms/courses/${accountId}/${courseId}/enrollments`
          );
          setStudents(studentsRes.data || []);
        } catch {
          setStudents([]);
        }
      } catch {
        setCourse(null);
        setStudents([]);
      }
      setLoading(false);
    };

    if (user?.user?.accountId && courseId) fetchData();
  }, [user?.user?.accountId, courseId]);

  // Calculate total modules, lessons, and completion percentage
  const modules = course?.modules || [];
  const totalModules = modules.length;
  const allLessons = modules.flatMap((mod) => mod.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(
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
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
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
      (selectedLesson.link || selectedLesson.url)
    ) {
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedLesson.title}
          </Typography>
          <DocumentRenderer url={selectedLesson.link || selectedLesson.url} />
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
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
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
                  <Box key={mod.id || mIdx}>
                    <ListItem disablePadding>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {mod.title}
                          </Typography>
                        }
                        secondary={mod.description}
                      />
                    </ListItem>
                    <List sx={{ pl: 2 }}>
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
                          const isCompleted =
                            lesson.status === true ||
                            lesson.status === "true" ||
                            lesson.status === 1 ||
                            lesson.status === "1";
                          return (
                            <ListItem
                              key={lesson.id || lIdx}
                              button
                              selected={
                                selectedLesson && selectedLesson.id === lesson.id
                              }
                              onClick={() => handleLessonClick(lesson)}
                              sx={{
                                borderLeft: isCompleted
                                  ? "4px solid #4caf50"
                                  : "4px solid transparent",
                                bgcolor:
                                  selectedLesson &&
                                  selectedLesson.id === lesson.id
                                    ? "action.selected"
                                    : "inherit",
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
                                  </Box>
                                }
                                secondary={lesson.content}
                              />
                            </ListItem>
                          );
                        })
                      )}
                    </List>
                    {mIdx < modules.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
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
                        {student.name ? student.name[0] : "S"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name || student.email || "Student"}
                      secondary={student.email}
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
