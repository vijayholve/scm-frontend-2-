import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../../../utils/apiService";

// StudentCourseViewer: Read-only view of a course, its modules, and lessons for students
const StudentCourseViewer = () => {
  const { id } = useParams(); // course id
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch course and modules/lessons
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const courseRes = await api.get(`/api/courses/getById/${id}`);
        setCourse(courseRes.data);
        const modulesRes = await api.get(`/api/courses/${id}/modules`);
        const modulesData = modulesRes.data || [];

        // For each module, fetch its lessons
        const modulesWithLessons = await Promise.all(
          modulesData.map(async (mod) => {
            try {
              const lessonsRes = await api.get(`/api/modules/${mod.id}/lessons`);
              return { ...mod, lessons: lessonsRes.data || [] };
            } catch {
              return { ...mod, lessons: [] };
            }
          })
        );
        setModules(modulesWithLessons);
      } catch {
        setCourse(null);
        setModules([]);
      }
      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography color="error">Course not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {course.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Status: {course.status}
        </Typography>
      </Paper>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Modules
      </Typography>
      {modules.length === 0 ? (
        <Typography color="text.secondary" sx={{ ml: 1 }}>
          No modules found for this course.
        </Typography>
      ) : (
        modules.map((mod, idx) => (
          <Paper key={mod.id} sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6">{mod.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {mod.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
              Lessons
            </Typography>
            {mod.lessons && mod.lessons.length > 0 ? (
              <List dense>
                {mod.lessons.map((lesson) => (
                  <ListItem key={lesson.id} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={lesson.title}
                      secondary={lesson.description}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ ml: 1, fontSize: 14 }}>
                No lessons found for this module.
              </Typography>
            )}
            {idx < modules.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default StudentCourseViewer;
