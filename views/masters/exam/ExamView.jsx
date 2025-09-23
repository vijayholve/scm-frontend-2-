import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Chip,
    Stack,
    ListItemIcon
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SubjectIcon from '@mui/icons-material/Subject';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const dummyExamDetails = {
    id: 1, examName: "Annual Science Examination", academicYear: "2025", examType: "WRITTEN", startDate: "2025-10-20T09:00:00.000Z", endDate: "2025-10-20T12:00:00.000Z", status: "SCHEDULED", maxMarksOverall: 175,
    examSubjects: [
        { id: 101, subjectId: 1, subjectName: "Physics", maxMarksSubject: 75, passingMarksSubject: 25, durationMinutes: 90, examDateTime: "2025-10-20T10:00:00.000Z" },
        { id: 102, subjectId: 2, subjectName: "Chemistry", maxMarksSubject: 100, passingMarksSubject: 33, durationMinutes: 120, examDateTime: "2025-10-21T10:00:00.000Z" }
    ]
};

const ExamView = () => {
    const { id: examId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setExam(dummyExamDetails);
        setLoading(false);
    }, [examId]);

    if (loading) return <MainCard title="Loading..."><Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box></MainCard>;
    if (!exam) return <MainCard title="Error"><Typography>Exam details could not be loaded.</Typography></MainCard>;
    
    return (
        <MainCard title="Exam Details" secondary={<BackButton BackUrl="/masters/exams" />}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                <Grid container spacing={4}>
                    {/* Exam Header */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h2" component="h1" gutterBottom>{exam.examName}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">Academic Year: {exam.academicYear}</Typography>
                            </Box>
                            <Chip 
                                label={exam.status} 
                                color={exam.status === 'SCHEDULED' ? 'primary' : 'success'} 
                                icon={<CheckCircleIcon />}
                            />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Key Information Cards */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SchoolIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Exam Type</Typography>
                                            <Typography variant="h6">{exam.examType}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Total Marks</Typography>
                                            <Typography variant="h6">{exam.maxMarksOverall}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarMonthIcon sx={{ mr: 2, color: 'success.main', fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                            <Typography variant="h6">{new Date(exam.startDate).toLocaleDateString()}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card variant="outlined">
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AccessTimeIcon sx={{ mr: 2, color: 'error.main', fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                            <Typography variant="h6">{new Date(exam.endDate).toLocaleDateString()}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Subjects Section */}
                    <Grid item xs={12}>
                        <Typography variant="h4" sx={{ mb: 2 }}>Subjects & Schedule</Typography>
                        <List component={Paper} elevation={1} sx={{ borderRadius: '8px' }}>
                            {exam.examSubjects.map((subject) => (
                                <React.Fragment key={subject.id}>
                                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                        <ListItemIcon>
                                            <SubjectIcon color="action" sx={{ fontSize: 30, mt: 1 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>{subject.subjectName}</Typography>}
                                            secondary={
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mt: 1 }}>
                                                    <Chip label={`Max Marks: ${subject.maxMarksSubject}`} variant="outlined" color="info" size="small" />
                                                    <Chip label={`Passing Marks: ${subject.passingMarksSubject}`} variant="outlined" color="success" size="small" />
                                                    <Chip label={`Duration: ${subject.durationMinutes} min`} variant="outlined" color="primary" size="small" />
                                                    <Chip label={`Scheduled: ${new Date(subject.examDateTime).toLocaleString()}`} variant="outlined" color="secondary" size="small" />
                                                </Stack>
                                            }
                                        />
                                    </ListItem>
                                    {exam.examSubjects.indexOf(subject) !== exam.examSubjects.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </MainCard>
    );
};

export default ExamView;