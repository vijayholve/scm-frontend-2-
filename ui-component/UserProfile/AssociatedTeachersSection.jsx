import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Grid, 
  Stack, 
  Typography, 
  Avatar, 
  Chip, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { IconUser, IconBook } from '@tabler/icons-react';
import MainCard from '../cards/MainCard';
import { useDataCache } from '../../contexts/DataCacheContext';
import { api, userDetails } from '../../utils/apiService';

/**
 * AssociatedTeachersSection Component
 * Displays teachers associated with the student's class and division
 *
 * @param {object} props - The component props
 * @param {object} props.student - The student object containing schoolId, classId, divisionId
 */
const AssociatedTeachersSection = ({ student }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchData } = useDataCache();
  console.log('AssociatedTeachersSection student prop:', student);

  useEffect(() => {
    if (student?.schoolId && student?.classId && student?.divisionId) {
      fetchTeachers();
    }
  }, [student?.schoolId, student?.classId, student?.divisionId,teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountId = userDetails.getAccountId();
      if (!accountId) {
        throw new Error('Account ID not found');
      }

      const payload = {
        schoolId: student.schoolId,
        classId: student.classId,
        divisionId: student.divisionId,
        page: 0,
        pageSize: 10, // Get all teachers for the student's class/division
        sortBy: 'id',
        sortDir: 'asc'
      };
      console.log('Fetching teachers with payload:', payload);

    //   const result = await fetchData(
    //     `/api/users/getAllBy/${accountId}?type=TEACHER`,
    //     payload
    //   );
        const result = await api.post(
        `/api/users/getAllBy/${accountId}?type=TEACHER`,
        payload
      );

      if (result.success && result.data) {
        setTeachers(result.data);
      } else {
        throw new Error('Failed to fetch teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const getTeacherInitials = (teacher) => {
    const firstName = teacher.firstName || '';
    const lastName = teacher.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSubjectDisplay = (teacher) => {
    if (teacher.subjects && teacher.subjects.length > 0) {
      return teacher.subjects.map(subject => subject.name || subject).join(', ');
    }
    return 'General';
  };

  if (!student?.schoolId || !student?.classId || !student?.divisionId) {
    return null;
  }

  return (
    <MainCard 
      title={
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconUser size={20} />
          <Typography variant="h6">Associated Teachers</Typography>
        </Stack>
      } 
      sx={{ mb: 4 }}
    >
      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && teachers.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
          No teachers found for this student's class and division.
        </Typography>
      )}

      {!loading && !error && teachers.length > 0 && (
        <Grid container spacing={2}>
          {teachers.map((teacher, index) => (
            <Grid item xs={12} sm={6} md={4} key={teacher.id || index}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {teacher.profileImage ? (
                      <img 
                        src={teacher.profileImage} 
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Typography variant="subtitle2">
                        {getTeacherInitials(teacher)}
                      </Typography>
                    )}
                  </Avatar>
                  
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'Unknown Teacher'}
                    </Typography>
                    
                    {teacher.email && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {teacher.email}
                      </Typography>
                    )}
                    
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                      <IconBook size={14} />
                      <Chip
                        label={getSubjectDisplay(teacher)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </MainCard>
  );
};

AssociatedTeachersSection.propTypes = {
  student: PropTypes.shape({
    schoolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    divisionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default AssociatedTeachersSection;