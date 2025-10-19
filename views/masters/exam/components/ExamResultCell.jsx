import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import React, { useState, useEffect } from 'react';

import  { userDetails } from 'utils/apiService';
import { api } from 'utils/apiService';
import { Typography } from '@mui/material';
import { Box } from 'lucide-react';
 const ExamResultCell = ({ examId }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const user = userDetails.getUser();

  useEffect(() => {
    let mounted = true;
    // determine if current user is a student
    const isStudent =
      !!user &&
      (
        (typeof user.role === 'string' && user.role.toUpperCase() === 'STUDENT') ||
        (typeof user.userType === 'string' && user.userType.toUpperCase() === 'STUDENT') ||
        (Array.isArray(user.roles) && user.roles.map(r => String(r).toUpperCase()).includes('STUDENT'))
      );

    if (!examId || !user?.id || !isStudent) {
      // if not a student, do not call student-specific endpoint
      setLoading(false);
      setResult(null);
      return;
    }

    const fetchResult = async () => {
      try {
        // only call student endpoint when user is a student
        const res = await api.get(`/api/exams/getStudentResult/${examId}/${user.id}`);
        if (mounted) setResult(res.data || null);
      } catch (err) {
        if (mounted) setResult(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchResult();
    return () => {
      mounted = false;
    };
  }, [examId, user]);

  if (loading) return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
  // if user is not student or no data, show N/A (or adapt to show teacher-specific info later)
  if (!result) return <Typography variant="body2" color="text.secondary">N/A</Typography>;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>{result.percentage?.toFixed(2) ?? '--'}%</Typography>
      <Typography variant="caption" color="text.secondary">Rank: {result.rank ?? '--'}</Typography>
    </Box>
  );
};
export default ExamResultCell;