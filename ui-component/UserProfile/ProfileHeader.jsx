// vijayholve/scm-frontend-2-/scm-frontend-2--99de9307ae1a364fb21e20fbb2fb04cd318f2064/ui-component/UserProfile/ProfileHeader.jsx

import React, { useState, useRef } from 'react'; // <-- ADDED useState, useRef
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast'; // <-- ADDED toast import

// material-ui
import { Avatar, Box, Typography, IconButton, Button, Input } from '@mui/material'; // <-- ADDED Button, Input
import { useTheme } from '@mui/material/styles';
import { IconArrowLeft, IconEdit, IconFile } from '@tabler/icons-react'; // <-- ADDED IconFile
import Dialog from '@mui/material/Dialog'; // <-- ADDED Dialog imports
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

/**
 * ProfileHeader Component
 * Handles its own profile picture edit logic and modal.
 * @param {object} props.user - The user object containing profile details.
 * @param {function} props.onBack - Callback for the back button.
 * (Note: The onEditPicture prop is removed/ignored as the logic is internal now)
 */
// The signature is simplified, we don't need onEditPicture anymore
const ProfileHeader = ({ user, onBack }) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  // Internal State for Picture Modal
  const [openPictureModal, setOpenPictureModal] = useState(false);
  const [selectedPictureFile, setSelectedPictureFile] = useState(null);

  const isLoggedInUser = true;

  // --- Internal Handlers for Picture Edit ---

  const handleOpenPictureModal = () => {
      setSelectedPictureFile(null); // Clear previous selection
      setOpenPictureModal(true);
  };
  
  const handlePictureFileChange = (event) => {
    setSelectedPictureFile(event.target.files[0]);
  };
  
  const handleSavePicture = () => {
      if (!selectedPictureFile) {
          toast.error('Please select a file to upload.');
          return;
      }
      
      // TODO: Integrate actual API call here to upload selectedPictureFile.
      console.log('Uploading file:', selectedPictureFile.name);
      
      toast.success(`Profile picture ${selectedPictureFile.name} upload triggered! (API integration needed)`);
      
      setSelectedPictureFile(null);
      setOpenPictureModal(false);
  };
  
  // --- End Internal Handlers ---

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {/* Back Button (visible on small screens) */}
        <Box sx={{ width: '100%', display: { xs: 'block', md: 'none' }, justifyContent: 'flex-start', mb: 2 }}>
          <IconButton onClick={onBack} aria-label="go back">
            <IconArrowLeft />
          </IconButton>
        </Box>

        {/* Avatar and Edit Option */}
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.text.primary,
              fontSize: '3rem',
              border: `3px solid ${theme.palette.primary.main}`,
              boxShadow: theme.shadows[8],
              mx: 'auto',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            alt="User Avatar"
          >
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
          </Avatar>
          {isLoggedInUser && (
            <IconButton
              size="small"
              onClick={handleOpenPictureModal} // <-- NOW CALLS INTERNAL HANDLER
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                border: `2px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.light
                }
              }}
              title="Edit Picture"
            >
              <IconEdit stroke={2} size="1rem" color={theme.palette.primary.main} />
            </IconButton>
          )}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role?.name || 'N/A'}
        </Typography>
      </Box>

      {/* NEW: Picture Edit Modal (Moved here as requested) */}
      <Dialog open={openPictureModal} onClose={() => setOpenPictureModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h4">Update Profile Picture</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{mb: 2}}>Select a new image file for your profile picture.</Typography>
          <input 
              accept="image/*" 
              style={{ display: 'none' }} 
              id="raised-button-file-internal" // Updated ID to prevent conflicts
              type="file" 
              onChange={handlePictureFileChange}
              ref={fileInputRef}
          />
          <label htmlFor="raised-button-file-internal">
            <Button 
                variant="outlined" 
                component="span" 
                startIcon={<IconFile stroke={1.5} size="1.3rem" />}
                fullWidth
            >
              {selectedPictureFile ? selectedPictureFile.name : 'Choose File'}
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenPictureModal(false); setSelectedPictureFile(null); }}>Cancel</Button>
          <Button 
              onClick={handleSavePicture} 
              variant="contained" 
              color="primary"
              disabled={!selectedPictureFile}
          >
            Upload & Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  // Removed onEditPicture from propTypes
  // onEditPicture: PropTypes.func, 
};

export default ProfileHeader;