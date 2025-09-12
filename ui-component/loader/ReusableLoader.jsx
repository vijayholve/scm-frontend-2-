import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

/**
 * A reusable component to display a centered loading spinner.
 * It takes up the full screen by default.
 *
 * @param {object} props - The component props.
 * @param {string} [props.message='Loading...'] - The message to display below the spinner.
 * @param {boolean} [props.showCard=false] - Whether to wrap the loader in a MainCard component.
 */
const ReusableLoader = ({ message = 'Loading...', showCard = false }) => {
  const loaderContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Use 100% of the parent container's height
        width: '100%',
        position: showCard ? 'relative' : 'fixed', // Position fixed for full screen, relative for card
        top: 0,
        left: 0,
        zIndex: showCard ? 'auto' : 9999, // High zIndex for full screen overlay
        backgroundColor: showCard ? 'transparent' : 'rgba(255, 255, 255, 0.8)',
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );

  return showCard ? <MainCard>{loaderContent}</MainCard> : loaderContent;
};

ReusableLoader.propTypes = {
  message: PropTypes.string,
  showCard: PropTypes.bool,
};

export default ReusableLoader;