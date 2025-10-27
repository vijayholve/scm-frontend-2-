import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api, { userDetails } from '../../../utils/apiService';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { toast } from 'react-hot-toast';
import ReusableLoader from 'ui-component/loader/ReusableLoader';
import { useTranslation } from 'react-i18next';

const examTypes = ['Midterm', 'Final', 'Quiz', 'Practical', 'Oral', 'Internal', 'Other'];

const EditExam = () => {
  const navigate = useNavigate();
  const { id: examId } = useParams();
  const { t } = useTranslation('edit');

  const [exam, setExam] = useState({
    examName: '',
    subject: '',
    examDate: '',
    examType: '',
    totalMarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (examId) {
      setLoading(true);
      api
        .get(`/api/exams/${examId}`)
        .then((response) => {
          const data = response.data;
          // Format date for the input field
          if (data.examDate) {
            data.examDate = new Date(data.examDate).toISOString().split('T')[0];
          }
          setExam(data);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(t('exam.messages.fetchError') || 'Failed to fetch exam details.');
          console.error(err);
          setLoading(false);
        });
    }
  }, [examId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...exam,
      accountId: userDetails.getAccountId(),
      createdBy: userDetails.getUser()?.userName,
      modifiedBy: userDetails.getUser()?.userName,
      totalMarks: Number(exam.totalMarks)
    };

    const apiCall = examId ? api.put(`/api/exams/update/${examId}`, payload) : api.post('/api/exams/create', payload);

    apiCall
      .then(() => {
        toast.success(
          examId ? t('exam.messages.updated') || 'Exam updated successfully!' : t('exam.messages.created') || 'Exam created successfully!'
        );
        navigate('/masters/exams');
      })
      .catch((err) => {
        toast.error(
          examId ? t('exam.messages.updateFailed') || 'Failed to update exam.' : t('exam.messages.createFailed') || 'Failed to create exam.'
        );
        console.error(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return <ReusableLoader message={t('exam.messages.loading') || 'Loading Exam Details...'} />;
  }

  return (
    <MainCard title={examId ? t('exam.title.edit') || 'Edit Exam' : t('exam.title.add') || 'Create Exam'}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label={t('exam.fields.examName') || 'Exam Name'}
              name="examName"
              value={exam.examName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label={t('exam.fields.subject') || 'Subject'}
              name="subject"
              value={exam.subject}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label={t('exam.fields.examDate') || 'Exam Date'}
              name="examDate"
              type="date"
              value={exam.examDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label={t('exam.fields.examType') || 'Exam Type'}
              name="examType"
              value={exam.examType}
              onChange={handleChange}
            >
              {examTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label={t('exam.fields.totalMarks') || 'Total Marks'}
              name="totalMarks"
              type="number"
              value={exam.totalMarks}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <BackButton BackUrl="/masters/exams" />
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting
              ? t('common.loading') || 'Saving...'
              : examId
                ? t('exam.messages.updateLabel') || 'Update Exam'
                : t('exam.messages.createLabel') || 'Create Exam'}
          </Button>
        </Box>
      </form>
    </MainCard>
  );
};

export default EditExam;
