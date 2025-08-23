import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Divider, Chip, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import api, { userDetails } from 'utils/apiService';
import { toast } from 'react-hot-toast';

const CertificateRow = ({ label, value }) => (
    <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={4}>
            <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography variant="body1">{value ?? '-'}</Typography>
        </Grid>
    </Grid>
);

const StudentExamResult = () => {
    const { examId } = useParams();
    const studentId = userDetails.getUser()?.id;
    const [loading, setLoading] = useState(false);
    const [examStudents, setExamStudents] = useState([]);

    useEffect(() => {
        const loadResults = async () => {
            if (!examId || !studentId) return;
            setLoading(true);
            try {
                const res = await api.get(`/api/exams/getExamStudent/${examId}/${studentId}`);
                setExamStudents(res.data || []);
            } catch (err) {
                console.error('Failed to load exam results:', err);
                toast.error('Could not load exam results.');
                setExamStudents([]);
            } finally {
                setLoading(false);
            }
        };
        loadResults();
    }, [examId, studentId]);

    const summary = useMemo(() => {
        if (!examStudents?.length) return null;
        let totalMax = 0;
        let totalObtained = 0;
        examStudents.forEach((es) => {
            totalMax += es?.totalMarks || 0;
            totalObtained += es?.marksObtained || 0;
        });
        const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
        const overall = examStudents[0] || {};
        return {
            examName: overall.examName,
            studentName: overall.studentName,
            className: overall.className,
            divisionName: overall.divisionName,
            schoolName: overall.schoolName,
            totalMax,
            totalObtained,
            percentage
        };
    }, [examStudents]);

    return (
        <MainCard title="Exam Result">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                            Examination Certificate
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {summary ? (
                            <>
                                <CertificateRow label="School" value={summary.schoolName} />
                                <CertificateRow label="Student" value={summary.studentName} />
                                <CertificateRow label="Exam" value={summary.examName} />
                                <CertificateRow label="Class / Division" value={`${summary.className} / ${summary.divisionName}`} />
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary">Total Marks</Typography>
                                            <Typography variant="h6">{summary.totalObtained} / {summary.totalMax}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary">Percentage</Typography>
                                            <Typography variant="h6">{summary.percentage}%</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Typography align="center" color="textSecondary">No results available.</Typography>
                        )}
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Subject-wise Details</Typography>
                        <Grid container spacing={2}>
                            {examStudents.map((row) => (
                                <Grid item xs={12} md={6} key={`${row.subjectId}-${row.id || Math.random()}`}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" sx={{ mb: 1 }}>{row.subjectName}</Typography>
                                        <CertificateRow label="Marks" value={`${row.marksObtained ?? 0} / ${row.totalMarks ?? 0}`} />
                                        <CertificateRow label="Grade" value={row.grade} />
                                        <CertificateRow label="Remarks" value={row.remarks} />
                                        {row.passed !== undefined && (
                                            <Chip label={row.passed ? 'Passed' : 'Failed'} color={row.passed ? 'success' : 'error'} size="small" />
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Box>
            )}
        </MainCard>
    );
};

export default StudentExamResult;


