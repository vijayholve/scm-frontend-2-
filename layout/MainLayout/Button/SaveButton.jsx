import React from 'react';
import PropTypes from 'prop-types';
// import { Button, Grid, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save'; // Import a save icon
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Button, Grid, Stack } from '@mui/material';
/**
 * Reusable Save Button Component
 * This component provides a consistent "Save" button with animation and loading state.
 * It's designed to be used within forms.
 *
 * @param {object} props - The component props.
 * @param {string} [props.title='Save'] - The text displayed on the button.
 * @param {boolean} [props.isSubmitting=false] - Controls the loading state and disables the button.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {string} [props.color='secondary'] - The color of the button (e.g., 'primary', 'secondary', 'success').
 * @param {string} [props.variant='contained'] - The variant of the button (e.g., 'contained', 'outlined', 'text').
 * @param {object} [props.sx={}] - Custom Material-UI sx prop for styling.
 */
const SaveButton = ({ title = 'Save', isSubmitting = false, onClick, color = 'secondary', variant = 'contained', sx = {} }) => {
  return (
    <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
      <Button
        disableElevation
        disabled={isSubmitting}
        type="submit" // Set type to "submit" for form submission
        variant={variant}
        color={color}
        onClick={onClick}
        startIcon={isSubmitting ? null : <SaveIcon />} // Show icon only when not submitting
        sx={{ minWidth: 120, ...sx }} // Ensure a consistent minimum width
      >
        {isSubmitting ? 'Saving...' : title}
      </Button>
      </Stack>
      </Grid>
  );
};

SaveButton.propTypes = {
  title: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onClick: PropTypes.func.isRequired, // onClick is required for a functional button
  color: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
};

export default SaveButton;