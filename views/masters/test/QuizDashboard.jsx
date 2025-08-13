import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Paper,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import api from "../../../utils/apiService";

// Sample JSON response for development/demo
const sampleDashboardData = {
    quiz: {
        id: 101,
        title: "Mathematics Final Exam",
        description: "Final assessment for Grade 8 Mathematics",
        numberOfQuestions: 20,
        startDate: "2024-06-01T09:00:00Z",
        endDate: "2024-06-01T10:00:00Z"
    },
    stats: {
        totalStudents: 30,
        attempted: 25,
        passed: 18,
        eligible: 28,
        class: "8A",
        division: "A",
        school: "Springfield High School"
    },
    students: [
        {
            id: 1,
            name: "John Doe",
            score: 85,
            attempted: true
        },
        {
            id: 2,
            name: "Jane Smith",
            score: 92,
            attempted: true
        },
        {
            id: 3,
            name: "Alice Johnson",
            score: null,
            attempted: false
        },
        {
            id: 4,
            name: "Bob Brown",
            score: 60,
            attempted: true
        }
        // ...more students
    ]
};

const QuizDashboard = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // For demo, use sample data. Replace with API call in production.
    useEffect(() => {
        // Uncomment below for real API call
        /*
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/quiz/dashboard/${quizId}`);
                setDashboardData(response.data);
            } catch (err) {
                setDashboardData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
        */
        // For demo:
        setTimeout(() => {
            setDashboardData(sampleDashboardData);
            setLoading(false);
        }, 500);
    }, [quizId]);

    if (loading) {
        return (
            <MainCard title="Quiz Dashboard">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (!dashboardData) {
        return (
            <MainCard title="Quiz Dashboard">
                <Alert severity="error">Failed to load dashboard data.</Alert>
            </MainCard>
        );
    }

    const { quiz, stats, students } = dashboardData;

    return (
        <MainCard title="Quiz Dashboard">
            {/* Quiz Details */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {quiz.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {quiz.description}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={1}>
                    <Chip label={`Questions: ${quiz.numberOfQuestions}`} color="primary" />
                    <Chip
                        label={`Start: ${new Date(quiz.startDate).toLocaleString()}`}
                        color="info"
                    />
                    <Chip
                        label={`End: ${new Date(quiz.endDate).toLocaleString()}`}
                        color="info"
                    />
                </Stack>
            </Paper>

            {/* Stats */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            School
                        </Typography>
                        <Typography variant="body1">{stats.school}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Class
                        </Typography>
                        <Typography variant="body1">{stats.class}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Division
                        </Typography>
                        <Typography variant="body1">{stats.division}</Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Chip
                            label={`Eligible: ${stats.eligible}`}
                            color="info"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Chip
                            label={`Attempted: ${stats.attempted}`}
                            color="primary"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        <Chip
                            label={`Passed: ${stats.passed}`}
                            color="success"
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Student List */}
            <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Student Scores
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                    <Grid item xs={3} sm={2}>
                        <Typography variant="subtitle2">Student ID</Typography>
                    </Grid>
                    <Grid item xs={5} sm={4}>
                        <Typography variant="subtitle2">Name</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Typography variant="subtitle2">Score</Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Typography variant="subtitle2">Action</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />
                {students && students.length > 0 ? (
                    students.map((student) => (
                        <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={student.id}
                            sx={{
                                py: 1,
                                backgroundColor: student.attempted ? "background.paper" : "#f9f9f9"
                            }}
                        >
                            <Grid item xs={3} sm={2}>
                                <Typography>{student.id}</Typography>
                            </Grid>
                            <Grid item xs={5} sm={4}>
                                <Typography>{student.name}</Typography>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                {student.attempted ? (
                                    <Chip
                                        label={`${student.score}%`}
                                        color={student.score >= 60 ? "success" : "error"}
                                        size="small"
                                    />
                                ) : (
                                    <Chip label="Not Attempted" color="default" size="small" />
                                )}
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                {student.attempted ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            navigate(`/masters/quiz/result/${quiz.id}?studentId=${student.id}`)
                                        }
                                    >
                                        View Result
                                    </Button>
                                ) : (
                                    <Button variant="outlined" size="small" disabled>
                                        View Result
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    ))
                ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                        No students found.
                    </Typography>
                )}
            </Paper>

            {/* Sample JSON for reference */}
            <Box mt={4}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Sample JSON Response:
                </Typography>
                <Paper sx={{ p: 2, background: "#f5f5f5", fontSize: 12, overflow: "auto" }}>
                    <pre style={{ margin: 0 }}>
                        {JSON.stringify(sampleDashboardData, null, 2)}
                    </pre>
                </Paper>
            </Box>
        </MainCard>
    );
};

export default QuizDashboard;
