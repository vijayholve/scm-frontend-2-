import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { MenuBook as BookIcon, Help as HelpIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DocumentationBanner = ({ showOnTop = true }) => {
  const navigate = useNavigate();

  const banner = (
    <Alert
      severity="info"
      sx={{
        mb: showOnTop ? 3 : 0,
        mt: showOnTop ? 0 : 3,
        bgcolor: 'primary.light',
        color: 'white',
        '& .MuiAlert-icon': { color: 'white' }
      }}
      icon={<HelpIcon />}
      action={
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<BookIcon />}
          onClick={() => navigate('/masters/documentation')}
          sx={{ color: 'white' }}
        >
          View Guide
        </Button>
      }
    >
      <AlertTitle sx={{ color: 'white', fontWeight: 'bold' }}>Need Help?</AlertTitle>
      Check out our comprehensive documentation to learn how to use all master data features effectively.
    </Alert>
  );

  return banner;
};

export default DocumentationBanner;
