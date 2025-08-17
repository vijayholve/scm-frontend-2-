import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowLeft } from '@tabler/icons-react'; // This is the standard import, assuming @tabler/icons-react is installed

/**
 * ProfileHeader Component
 * Displays the user's avatar, name, role, and a back button for navigation.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing firstName, lastName, and role.
 * @param {function} props.onBack - Callback function for the back button.
 */
const ProfileHeader = ({ user, onBack }) => {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      {/* Back Button (visible on small screens) */}
      <Box sx={{ width: '100%', display: { xs: 'block', md: 'none' }, justifyContent: 'flex-start', mb: 2 }}>
        <IconButton onClick={onBack} aria-label="go back">
          <IconArrowLeft />
        </IconButton>
      </Box>

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
          mb: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
        alt="User Avatar"
      >
        {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
      </Avatar>
      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user?.role?.name || 'N/A'}
      </Typography>
    </Box>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ProfileHeader;
