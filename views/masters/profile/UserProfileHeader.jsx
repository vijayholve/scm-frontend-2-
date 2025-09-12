// src/views/masters/profile/UserProfileHeader.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography, IconButton, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowLeft, IconReceipt2, IconAward, IconFileText } from '@tabler/icons-react';
import { hasPermission } from 'utils/permissionUtils'; // Assuming this utility exists
import { useSelector } from 'react-redux';

/**
 * UserProfileHeader Component
 * Displays the user's avatar, name, and role.
 * On large screens, it shows action buttons.
 * On small screens, it shows a back button.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing firstName, lastName, and role.
 * @param {function} props.onBack - Callback function for the back button.
 */
const UserProfileHeader = ({ user, onBack }) => {
  const theme = useTheme();
  const permissions = useSelector((state) => state.user.permissions);
  const userRole = user?.type?.toUpperCase();

  const isStudent = userRole === 'STUDENT';
  const hasFeePermission = isStudent && hasPermission(permissions, 'FEE_MANAGEMENT', 'view');
  const hasExamPermission = isStudent && hasPermission(permissions, 'EXAM', 'view');
  const hasDocumentPermission = hasPermission(permissions, 'DOCUMENT_HUB', 'view');

  return (
    <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', [theme.breakpoints.down('md')]: { justifyContent: 'space-between' } }}>
          <IconButton onClick={onBack} aria-label="go back" sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconArrowLeft />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, [theme.breakpoints.down('md')]: { ml: 'auto' } }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: '2rem',
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5">{user?.firstName} {user?.lastName}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.role?.name}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
            {hasFeePermission && (
              <Button variant="outlined" startIcon={<IconReceipt2 />}>My Fees</Button>
            )}
            {hasExamPermission && (
              <Button variant="outlined" startIcon={<IconAward />}>My Exams</Button>
            )}
            {hasDocumentPermission && (
              <Button variant="outlined" startIcon={<IconFileText />}>My Documents</Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

UserProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default UserProfileHeader;