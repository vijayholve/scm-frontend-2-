import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from '../../ui-component/cards/MainCard'; // Corrected import path for MainCard

// assets
import {
  IconMail,
  IconId,
  IconPhone,
  IconMapPin,
  IconUserCircle,
} from '@tabler/icons-react'; // Standard import for @tabler/icons-react

/**
 * UserDetailsSection Component
 * Displays basic user details such as username, email, mobile, address, and student ID.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing relevant details.
 */
const UserDetailsSection = ({ user }) => {
  const theme = useTheme();

  return (
    <MainCard title="User Details" sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconUserCircle stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
              <Typography variant="body2" color="text.secondary">
                Username: <Typography component="span" variant="subtitle2" color="text.primary">{user?.userName || 'N/A'}</Typography>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconMail stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
              <Typography variant="body2" color="text.secondary">
                Email: <Typography component="span" variant="subtitle2" color="text.primary">{user?.email || 'N/A'}</Typography>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconPhone stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
              <Typography variant="body2" color="text.secondary">
                Mobile: <Typography component="span" variant="subtitle2" color="text.primary">{user?.mobile || 'N/A'}</Typography>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconMapPin stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
              <Typography variant="body2" color="text.secondary">
                Address: <Typography component="span" variant="subtitle2" color="text.primary">{user?.address || 'N/A'}</Typography>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* Student-specific data */}
          {user.type === 'STUDENT' && (
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconId stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                <Typography variant="body2" color="text.secondary">
                  Student ID: <Typography component="span" variant="subtitle2" color="text.primary">{user?.rollNo || 'N/A'}</Typography>
                </Typography>
              </Stack>
            </Stack>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

UserDetailsSection.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserDetailsSection;
