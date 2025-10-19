import React from 'react';
import { Button, Chip, Box, Typography } from '@mui/material';
import { MenuBook as BookIcon, OpenInNew as OpenIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DocumentationLink = ({ variant = 'button', showDescription = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/masters/documentation');
  };

  if (variant === 'chip') {
    return (
      <Chip
        icon={<BookIcon />}
        label="Documentation"
        onClick={handleClick}
        color="primary"
        variant="outlined"
        sx={{ cursor: 'pointer' }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <Box
        onClick={handleClick}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'primary.light',
            color: 'white'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BookIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Documentation
          </Typography>
          <OpenIcon sx={{ ml: 'auto', fontSize: 20 }} />
        </Box>
        {showDescription && (
          <Typography variant="body2" color="text.secondary">
            Complete guide to all master data features with step-by-step instructions
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Button
      variant="outlined"
      startIcon={<BookIcon />}
      endIcon={<OpenIcon />}
      onClick={handleClick}
      sx={{ textTransform: 'none' }}
    >
      View Documentation
    </Button>
  );
};

export default DocumentationLink;