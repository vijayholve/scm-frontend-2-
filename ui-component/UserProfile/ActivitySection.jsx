import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import AssociatedTeachersSection from './AssociatedTeachersSection';

// assets
import { IconBriefcase, IconLock, IconBug, IconBook } from '@tabler/icons-react';

/**
 * ActivitySection Component
 * Displays a list of activities or areas a user spends most of their time on.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing the timeSpentOn array.
 */
const ActivitySection = ({ user }) => {
  console.log('ActivitySection user prop:', user);

  return (
    <>
      {/* Associated Teachers Section - Only show for students */}
      {user.type === 'STUDENT' && <AssociatedTeachersSection student={user} />}

      {/* Original Activity Section */}
      {user.timeSpentOn && user.timeSpentOn.length > 0 && (
       <></>
      )}
    </>
  );
};

ActivitySection.propTypes = {
  user: PropTypes.object.isRequired
};

export default ActivitySection;
