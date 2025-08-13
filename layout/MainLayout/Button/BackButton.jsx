import { useNavigate } from 'react-router-dom';
import { Button, Grid, Stack } from '@mui/material';

//   import React from 'react'

const BackButton = ({ BackUrl = '' }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (BackUrl) {
      navigate(BackUrl);
    } else {
      navigate(-1); // Go back to previous page
    }
  };
  return (
    <>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Grid>
    </>
  );
};

export default BackButton;
