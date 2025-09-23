import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography, Avatar } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard'; // Corrected import path

/**
 * CollaborationSection Component
 * Displays a list of people the user frequently collaborates with.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing the worksWith array.
 */
const CollaborationSection = ({ user }) => {
  return (
    user.worksWith && user.worksWith.length > 0 && (
      <MainCard
      //  title="Works most with..."
       >
        {/* <Stack direction="row" flexWrap="wrap" spacing={2}>
          {user.worksWith.map((person, index) => (
            <Stack key={index} alignItems="center" spacing={0.5}>
              <Avatar src={person.avatar} alt={person.name} sx={{ width: 48, height: 48 }} />
              <Typography variant="caption" sx={{ textAlign: 'center' }}>{person.name}</Typography>
            </Stack>
          ))}
        </Stack> */}
      </MainCard>
    )
  );
};

CollaborationSection.propTypes = {
  user: PropTypes.object.isRequired,
};

export default CollaborationSection;
