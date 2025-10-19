// views/lms/course/CourseViewHeader.jsx
import React from "react";
import { 
    Box, 
    Typography, 
    Paper, 
    LinearProgress, 
    Chip, 
    Stack, 
    Button, 
    CircularProgress 
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const CourseViewHeader = ({ 
    course, 
    totalModules, 
    totalLessons, 
    completedLessons, 
    isEnrolled, 
    userType,
    enrollLoading,
    handleEnrollNow
}) => {
    const completionPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    return (
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
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Chip label={`Modules: ${totalModules}`} color="primary" />
                        <Chip label={`Lessons: ${totalLessons}`} color="secondary" />
                        <Chip label={`Status: ${course.status || "N/A"}`} />
                    </Stack>
                </Box>
            </Box>
            
            {(userType === 'STUDENT' && isEnrolled) && (
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
            )}
            
            {(userType === 'STUDENT' && !isEnrolled) && (
                <Box sx={{ minWidth: 250, mt: { xs: 3, md: 0 }, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="warning.dark" sx={{ mb: 1 }}>
                        Enrollment Required
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleEnrollNow}
                        disabled={enrollLoading}
                        startIcon={enrollLoading ? <CircularProgress size={16} /> : <PlayArrowIcon />}
                        size="large"
                    >
                        {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default CourseViewHeader;