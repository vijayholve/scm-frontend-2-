import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if not already there

const NavingateToOtherPage = ({ title = 'Cancel', PageUrl }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <>
      <AnimateButton>
        <Button
          disableElevation
          variant="outlined"
          color="primary"
          onClick={() => navigate(`${PageUrl}`)} // Use navigate here
        >
          {title}
        </Button>
      </AnimateButton>
    </>
  );
};

// Add prop-types validation
NavingateToOtherPage.propTypes = {
  title: PropTypes.string, // 'title' is expected to be a string
  PageUrl: PropTypes.string.isRequired // 'PageUrl' is expected to be a string and is required
};

export default NavingateToOtherPage;