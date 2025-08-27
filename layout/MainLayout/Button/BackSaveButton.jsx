import React from 'react';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';

// Assuming these are correctly imported from their respective paths
import BackButton from './BackButton';
import SaveButton from './SaveButton';
import AnimateButton from 'ui-component/extended/AnimateButton';

/**
 * Reusable Back and Save Button Component
 * This component combines a BackButton and SaveButton for consistent form actions.
 *
 * @param {object} props - The component props.
 * @param {string} [props.title='Save'] - The text displayed on the save button.
 * @param {boolean} [props.isSubmitting=false] - Controls the loading state and disables the save button.
 * @param {function} props.onSaveClick - The function to call when the save button is clicked.
 * @param {string} props.backUrl - The URL to navigate to when the back button is clicked.
 */
const BackSaveButton = ({ title, backUrl, isSubmitting = false, onSaveClick = null }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <AnimateButton>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <BackButton backUrl={backUrl} />
          <SaveButton title={title} isSubmitting={isSubmitting}
          
          onClick={onSaveClick}
           disabled={isSubmitting} />
        </Box>
      </AnimateButton>
    </Box>
  );
}; 

export default BackSaveButton;

BackSaveButton.propTypes = {
  title: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onSaveClick: PropTypes.func.isRequired,
  backUrl: PropTypes.string.isRequired
};
