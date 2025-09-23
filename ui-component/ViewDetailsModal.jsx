import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Box } from '@mui/material';

/**
 * Generic modal to display details of a record in a key-value format.
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {object} props.data - The data object to display
 * @param {string} [props.title] - Optional title for the modal
 */
const ViewDetailsModal = ({ open, onClose, data, title }) => {
  if (!data) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || 'Details'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            {Object.entries(data).map(([key, value]) => (
              <React.Fragment key={key}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {key}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1">{String(value)}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  title: PropTypes.string
};

export default ViewDetailsModal;
