// views/lms/course/CourseViewOutline.jsx

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Box
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import propTypes from 'prop-types';

const CourseViewOutline = ({
  modules = [],
  students = [],
  expandedModules = [],
  handleLessonClick,
  handleAccordionChange,
  userType,
  isEnrolled,
  selectedLesson,
  progressByLessonId = new Set(),
  isLogin
}) => {
  const getLessonIcon = (lessonType) => {
    switch (lessonType?.toLowerCase()) {
      case 'video':
        return <PlayCircleOutlineIcon fontSize="small" />;
      case 'document':
      case 'reading':
        return <DescriptionIcon fontSize="small" />;
      case 'quiz':
      case 'assessment':
        return <QuizIcon fontSize="small" />;
      default:
        return <DescriptionIcon fontSize="small" />;
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Course Outline
        </Typography>

        {modules.length === 0 ? (
          <Typography color="text.secondary">No modules found for this course.</Typography>
        ) : (
          <List dense>
            {modules.map((mod, mIdx) => (
              <Accordion
                key={mod.id || mIdx}
                expanded={expandedModules.includes(mod.id)}
                onChange={handleAccordionChange(mod.id)}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    minHeight: 48,
                    '&.Mui-expanded': {
                      minHeight: 48
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {mod.title || `Module ${mIdx + 1}`}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {(mod.lessons || []).map((lesson, lIdx) => {
                      const isCompleted = progressByLessonId.has(lesson.id);

                      // LOCK CHECK: Only lock if user is a STUDENT and NOT enrolled
                      const isLocked = userType === 'STUDENT' && !isEnrolled;

                      return (
                        <ListItem
                          key={lesson.id || lIdx}
                          button
                          selected={selectedLesson?.id === lesson.id}
                          onClick={() => handleLessonClick(lesson, mod.id)}
                          sx={{
                            borderLeft: isCompleted ? '4px solid #4caf50' : '4px solid transparent',
                            bgcolor: selectedLesson?.id === lesson.id ? 'action.selected' : 'inherit',
                            opacity: isLocked ? 0.8 : 1,
                            pointerEvents: 'auto',
                            pl: 2
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 35 }}>{getLessonIcon(lesson.type)}</ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ fontWeight: 500, fontSize: 14 }}>{lesson.title}</Typography>}
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isCompleted ? (
                                  <Chip
                                    label="Completed"
                                    size="small"
                                    color="success"
                                    icon={<CheckCircleIcon style={{ fontSize: 16 }} />}
                                  />
                                ) : isLocked ? (
                                  <Chip
                                    label="Enroll to Access"
                                    size="small"
                                    color="default"
                                    icon={<LockIcon style={{ fontSize: 16 }} />}
                                  />
                                ) : (
                                  <Typography variant="caption" color="text.secondary">
                                    {lesson.type || 'Lesson'}
                                  </Typography>
                                )}
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
          </List>
        )}
      </Paper>

      {/* Enrolled Students (Admin/Teacher View Only) */}
      {isLogin && (userType === 'TEACHER' || userType === 'ADMIN') && students.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Enrolled Students ({students.length})
          </Typography>
          <List dense>
            {students.map((student, idx) => (
              <ListItem key={student.id || idx} divider={idx < students.length - 1}>
                <ListItemText primary={student.name || 'Student'} secondary={student.email || student.studentId} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </>
  );
};

CourseViewOutline.propTypes = {
  modules: propTypes.array,
  students: propTypes.array,
  expandedModules: propTypes.array,
  handleLessonClick: propTypes.func.isRequired,
  handleAccordionChange: propTypes.func.isRequired,
  userType: propTypes.string.isRequired,
  isEnrolled: propTypes.bool.isRequired,
  selectedLesson: propTypes.object,
  progressByLessonId: propTypes.object,
  isLogin: propTypes.bool.isRequired
};

export default CourseViewOutline;
