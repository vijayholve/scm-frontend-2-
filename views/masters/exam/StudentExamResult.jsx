import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Divider, Chip, CircularProgress } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import api, { userDetails } from 'utils/apiService';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
const CertificateRow = ({ label, value }) => (
  <Grid container spacing={1} sx={{ mb: 1 }}>
    <Grid item xs={4}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="body1">{value ?? '-'}</Typography>
    </Grid>
  </Grid>
);

const StudentExamResult = () => {
  const { examId } = useParams();
  const studentId = userDetails.getUser()?.id;
  const { t } = useTranslation('exam');
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
        toast.error(t('errors.loadExamResults') || 'Could not load exam results.');
        setExamStudents([]);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [examId, studentId, t]);

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
    <MainCard title={t('title.examResult') || 'Exam Result'}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
              {t('title.examinationCertificate') || 'Examination Certificate'}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {summary ? (
              <>
                <CertificateRow label={t('labels.school') || 'School'} value={summary.schoolName} />
                <CertificateRow label={t('labels.student') || 'Student'} value={summary.studentName} />
                <CertificateRow label={t('labels.exam') || 'Exam'} value={summary.examName} />
                <CertificateRow
                  label={t('labels.classDivision') || 'Class / Division'}
                  value={`${summary.className} / ${summary.divisionName}`}
                />
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        {t('labels.totalMarks') || 'Total Marks'}
                      </Typography>
                      <Typography variant="h6">
                        {summary.totalObtained} / {summary.totalMax}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        {t('labels.percentage') || 'Percentage'}
                      </Typography>
                      <Typography variant="h6">{summary.percentage}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography align="center" color="textSecondary">
                {t('messages.noResults') || 'No results available.'}
              </Typography>
            )}
          </Paper>

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('title.subjectWiseDetails') || 'Subject-wise Details'}
            </Typography>
            <Grid container spacing={2}>
              {examStudents.map((row) => (
                <Grid item xs={12} md={6} key={`${row.subjectId}-${row.id || Math.random()}`}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {row.subjectName}
                    </Typography>
                    <CertificateRow label={t('labels.marks') || 'Marks'} value={`${row.marksObtained ?? 0} / ${row.totalMarks ?? 0}`} />
                    <CertificateRow label={t('labels.grade') || 'Grade'} value={row.grade} />
                    <CertificateRow label={t('labels.remarks') || 'Remarks'} value={row.remarks} />
                    {row.passed !== undefined && (
                      <Chip
                        label={row.passed ? t('labels.passed') || 'Passed' : t('labels.failed') || 'Failed'}
                        color={row.passed ? 'success' : 'error'}
                        size="small"
                      />
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
