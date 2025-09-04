import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Alert, Box, CircularProgress, Avatar, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from 'utils/apiService';
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import { IconCreditCard, IconAward, IconBook2, IconCalendarEvent, IconClipboardList, IconPencil, IconChevronRight, IconFileDescription } from '@tabler/icons-react';
import StudentAttendanceChart from './StudentAttendanceChart';

// Dummy data for the student summary card
const dummySummaryData = {
    totalAssignments: 15,
    upcomingExams: 3,
    enrolledCourses: 5,
    pendingSubmissions: 4
};

// Dummy data for student timetable
const dummyTimetable = [
    { id: 1, subjectName: "Mathematics", type: "Lecture", hour: 10, minute: 0, teacherName: "Mr. Smith" },
    { id: 2, subjectName: "Physics", type: "Lab", hour: 11, minute: 30, teacherName: "Ms. Jones" }
];

// Dummy data for upcoming assignments
const dummyAssignments = [
    { id: 1, name: "Algebra Homework", deadLine: "2025-09-10T00:00:00Z" },
    { id: 2, name: "History Essay", deadLine: "2025-09-15T00:00:00Z" }
];

// Dummy data for upcoming exams
const dummyExams = [
    { id: 1, examName: "Mid-Term Exam", startDate: "2025-09-20T00:00:00Z" },
    { id: 2, examName: "Finals", startDate: "2025-12-15T00:00:00Z" }
];

// Dummy data for attendance chart
const dummyAttendanceData = {
    present: 25,
    absent: 5
};

// Student Timetable Component
const StudentTimetable = () => {
    const [timetable, setTimetable] = useState(dummyTimetable);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user);
    const theme = useTheme();

    useEffect(() => {
        // In a real application, you would fetch this data from an API
        // const fetchTimetable = async () => {
        //     if (!user?.id || !user?.accountId) {
        //         setError('User not authenticated.');
        //         setLoading(false);
        //         return;
        //     }
        //     setLoading(true);
        //     const today = new Date();
        //     const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        //     try {
        //         const response = await api.get(`/api/timetable/timeslot/day/student/${dayName}/${user.accountId}/${user.id}`);
        //         setTimetable(response.data || []);
        //     } catch (err) {
        //         setError('Failed to load timetable. Please try again later.');
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchTimetable();
    }, [user]);

    if (loading) {
        return (
            <MainCard title="Today's Timetable">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="Today's Timetable">
                <Alert severity="error">{error}</Alert>
            </MainCard>
        );
    }

    return (
        <MainCard title="Today's Timetable" sx={{ height: '100%' }}>
            {timetable.length > 0 ? (
                <List dense>
                    {timetable.map((slot) => (
                        <ListItem key={slot.id} secondaryAction={<IconChevronRight />}>
                            <ListItemText
                                primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{`${slot.subjectName} (${slot.type})`}</Typography>}
                                secondary={<Typography variant="body2" color="text.secondary">{`Time: ${slot.hour}:${slot.minute} - Teacher: ${slot.teacherName}`}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" align="center" color="text.secondary">
                    No classes scheduled for today.
                </Typography>
            )}
        </MainCard>
    );
};

// Student Quick Links Component
const StudentQuickLinks = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const actions = [
        { label: "My Fees", icon: <IconCreditCard stroke={1.5} size="1.3rem" />, color: theme.palette.primary.main, bgcolor: theme.palette.primary.light, route: '/masters/student/fees' },
        { label: "My Grades", icon: <IconAward stroke={1.5} size="1.3rem" />, color: theme.palette.secondary.main, bgcolor: theme.palette.secondary.light, route: '/masters/exams/student' },
        { label: "My Courses", icon: <IconBook2 stroke={1.5} size="1.3rem" />, color: theme.palette.success.dark, bgcolor: theme.palette.success.light, route: '/masters/lms' }
    ];

    return (
        <MainCard title="Quick Links" sx={{ height: '100%' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                {actions.map((action, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Tooltip title={action.label}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.largeAvatar,
                                        cursor: 'pointer',
                                        color: action.color,
                                        bgcolor: action.bgcolor,
                                        mx: 'auto',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            boxShadow: 2,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    onClick={() => navigate(action.route)}
                                >
                                    {action.icon}
                                </Avatar>
                            </Tooltip>
                            <Typography variant="body2" sx={{ mt: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {action.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </MainCard>
    );
};

// Student Summary Card Component
const StudentSummaryCard = () => {
    const { user } = useSelector((state) => state.user);
    const [summaryData, setSummaryData] = useState(dummySummaryData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In a real application, you would fetch this data from an API
        // const fetchSummary = async () => {
        //     if (!user?.id) return;
        //     setLoading(true);
        //     try {
        //         const response = await api.get(`/api/dashboard/student-summary/${user.id}`);
        //         setSummaryData(response.data);
        //     } catch (err) {
        //         console.error("Error fetching summary data:", err);
        //         setError('Failed to load summary data.');
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchSummary();
    }, [user]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <MainCard >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Total Assignments</Typography>
                            <Typography variant="h4">{summaryData.totalAssignments}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Upcoming Exams</Typography>
                            <Typography variant="h4">{summaryData.upcomingExams}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Enrolled Courses</Typography>
                            <Typography variant="h4">{summaryData.enrolledCourses}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Pending Submissions</Typography>
                            <Typography variant="h4">{summaryData.pendingSubmissions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </MainCard>
    );
};

// My Documents Component
const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchDocuments = async () => {
            // Check for user and account ID
            if (!user?.id || !user?.accountId) {
                setError('User not authenticated.');
                setLoading(false);
                return;
            }
            setLoading(true);

            // API call logic for fetching documents
            // This is commented out as per the request to use dummy data for now
            /*
            try {
                const response = await api.get(`/api/documents/getAllBy/${user.accountId}`);
                setDocuments(response.data || []);
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError('Failed to load documents.');
            } finally {
                setLoading(false);
            }
            */

            // Dummy data for demonstration purposes
            const dummyDocuments = [
                { id: 1, name: "Math Syllabus", type: "PDF", uploadDate: "2024-08-25" },
                { id: 2, name: "Science Project Guidelines", type: "DOCX", uploadDate: "2024-08-20" },
                { id: 3, name: "Exam Schedule", type: "XLSX", uploadDate: "2024-08-15" }
            ];
            
            setTimeout(() => {
                setDocuments(dummyDocuments);
                setLoading(false);
            }, 1000);

        };

        fetchDocuments();
    }, [user]);

    return (
        <MainCard title="My Documents" sx={{ height: '100%' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : documents.length > 0 ? (
                <List dense>
                    {documents.map((doc) => (
                        <ListItem key={doc.id} secondaryAction={<IconFileDescription />}>
                            <ListItemText
                                primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{doc.name}</Typography>}
                                secondary={<Typography variant="body2" color="text.secondary">{`Uploaded: ${doc.uploadDate} | Type: ${doc.type}`}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" align="center" color="text.secondary">
                    No documents found.
                </Typography>
            )}
        </MainCard>
    );
};


// Main Student Dashboard Component
const StudentDashboardV1 = () => {
    const { user } = useSelector((state) => state.user);
    const [dashboardData, setDashboardData] = useState({
        upcomingAssignments: dummyAssignments,
        upcomingExams: dummyExams,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // In a real application, you would fetch this data from an API
        // const fetchData = async () => {
        //     if (!user?.id) {
        //         setError('User not authenticated.');
        //         setLoading(false);
        //         return;
        //     }
        //     try {
        //         setLoading(true);
        //         const [assignmentsRes, examsRes] = await Promise.all([
        //             api.get(`/api/assignments/student/${user.id}/upcoming`),
        //             api.get(`/api/exams/student/${user.id}/upcoming`)
        //         ]);

        //         setDashboardData({
        //             upcomingAssignments: assignmentsRes.data || [],
        //             upcomingExams: examsRes.data || [],
        //         });
        //     } catch (err) {
        //         console.error("Error fetching student dashboard data:", err);
        //         setError('Failed to load dashboard data.');
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchData();
    }, [user]);

    if (loading) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                </Grid>
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
           <Grid item xs={12}>
                <StudentSummaryCard />
            </Grid>
            <Grid item xs={12} lg={4}>
                <StudentTimetable />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
                <StudentAttendanceChart studentId={user?.id} />
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
                <StudentQuickLinks />
            </Grid>
         <Grid item xs={12} md={6}>
                <MainCard title="Upcoming Exams" sx={{ height: '100%' }}>
                    <List dense>
                        {dashboardData.upcomingExams.length > 0 ? (
                            dashboardData.upcomingExams.map((exam, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={exam.examName}
                                        secondary={`Date: ${new Date(exam.startDate).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                No upcoming exams.
                            </Typography>
                        )}
                    </List>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <MainCard title="Upcoming Assignments" sx={{ height: '100%' }}>
                    <List dense>
                        {dashboardData.upcomingAssignments.length > 0 ? (
                            dashboardData.upcomingAssignments.map((assignment, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={assignment.name}
                                        secondary={`Due: ${new Date(assignment.deadLine).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center">
                                No upcoming assignments.
                            </Typography>
                        )}
                    </List>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MyDocuments />
            </Grid>
        </Grid>
    );
};

export default StudentDashboardV1;