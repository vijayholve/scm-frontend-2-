import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddLessonModal from "./AddLessonModal";

/**
 * LessonList component
 * Props:
 *   lessons: array of lesson objects
 *   moduleId: string or number (module id)
 *   courseId: string or number (course id)
 *   refreshModules: function to refresh modules list (to re-fetch modules/lessons)
 */
const LessonList = ({ lessons = [], moduleId, courseId, refreshModules }) => {
  const [openAddLesson, setOpenAddLesson] = useState(false);

  return (
    <Box sx={{ mt: 2, ml: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Lessons
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddLesson(true)}
        >
          Add Lesson
        </Button>
      </Box>
      {lessons.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontSize: 14, ml: 1 }}>
          No lessons found for this module.
        </Typography>
      ) : (
        <List dense>
          {lessons.map((lesson) => (
            <ListItem key={lesson.id} sx={{ pl: 0 }}>
              <ListItemText
                primary={lesson.title}
                secondary={lesson.description}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  color="primary"
                  // onClick={() => handleEditLesson(lesson)} // Implement edit logic if needed
                >
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <AddLessonModal
        open={openAddLesson}
        onClose={() => setOpenAddLesson(false)}
        moduleId={moduleId}
        courseId={courseId}
        onLessonAdded={refreshModules}
      />
    </Box>
  );
};

export default LessonList;
