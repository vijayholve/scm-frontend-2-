import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard'; // Corrected import path

// assets
import {
  IconBriefcase,
  IconLock,
  IconBug,
  IconBook,
} from '@tabler/icons-react';

/**
 * ActivitySection Component
 * Displays a list of activities or areas a user spends most of their time on.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing the timeSpentOn array.
 */
const ActivitySection = ({ user }) => {
  return (
    user.timeSpentOn && user.timeSpentOn.length > 0 && (
      <MainCard title={`${user.firstName} spends most of their time on...`} sx={{ mb: 4 }}>
        <Grid container spacing={1}>
          {user.timeSpentOn.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {item.icon}
                <Typography variant="body2">{item.text}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </MainCard>
    )
  );
};

ActivitySection.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ActivitySection;
