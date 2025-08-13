import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';

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
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}><Typography variant="h3" gutterBottom>{exam.examName}</Typography><Typography variant="h5" color="textSecondary">Academic Year: {exam.academicYear}</Typography></Grid>
                    <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1"><strong>Exam Type:</strong> {exam.examType}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1"><strong>Total Marks:</strong> {exam.maxMarksOverall}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1"><strong>Start Date:</strong> {new Date(exam.startDate).toLocaleString()}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography variant="subtitle1"><strong>End Date:</strong> {new Date(exam.endDate).toLocaleString()}</Typography></Grid>
                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Typography variant="h4">Subjects & Schedule</Typography>
                        <List>
                            {exam.examSubjects.map((subject) => (
                                <ListItem key={subject.id} divider>
                                    <ListItemText
                                        primary={<Typography variant="h6">{subject.subjectName}</Typography>}
                                        secondary={<><Typography component="span" display="block">Max Marks: {subject.maxMarksSubject}</Typography><Typography component="span" display="block">Passing Marks: {subject.passingMarksSubject}</Typography><Typography component="span" display="block">Duration: {subject.durationMinutes} minutes</Typography><Typography component="span" display="block">Scheduled for: {new Date(subject.examDateTime).toLocaleString()}</Typography></>}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </MainCard>
    );
};

export default ExamView;