import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { IconChalkboard, IconCertificate } from '@tabler/icons-react';
import TeacherClassesList from './TeacherClassesList';
import { useTranslation } from 'react-i18next';

const TeacherDetails = ({ user }) => {
  const { t } = useTranslation('profile');

  // Dummy data for demonstration
  const teacherInfo = {
    subject: 'Mathematics',
    qualification: 'M.Sc. in Mathematics',
    experience: '10 years',
    ...user
  };
  

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('labelTeacherInformation')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconChalkboard size="1.2rem" style={{ marginRight: '8px' }} />
            <Typography variant="body1">
              <strong>{t('labelSubject')}:</strong> {teacherInfo.subject}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconCertificate size="1.2rem" style={{ marginRight: '8px' }} />
            <Typography variant="body1">
              <strong>{t('labelQualification')}:</strong> {teacherInfo.qualification}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <TeacherClassesList teacherId={user} />
      </Box>  

    </Paper>
  );
};

export default TeacherDetails;
