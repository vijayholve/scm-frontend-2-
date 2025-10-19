import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, CircularProgress } from '@mui/material';
import { userDetails } from '../../utils/apiService';
import { LMSThemeProvider, useLMSTheme } from '../../contexts/LMSThemeContext';

// Inner component that uses the theme context
const LMSLayoutInner = ({ children }) => {
  const { theme } = useLMSTheme();
  const [userType, setUserType] = useState('guest');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('SCM-AUTH');
    setUserType('guest');
    window.location.href = '/lms';
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = localStorage.getItem('SCM-AUTH');

      if (!authToken) {
        setUserType('guest');
        setIsLoading(false);
        return;
      }

      const authData = JSON.parse(authToken);

      if (authData && authData.accessToken) {
        const user = userDetails.getUser();
        const accountId = userDetails.getAccountId();

        if (user && accountId) {
          setUserType('user');
        } else {
          setUserType('user');
        }
      } else {
        setUserType('guest');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUserType('guest');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      <Navbar userType={userType} onLogout={handleLogout} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

// Main component that provides the theme context
const LMSLayout = ({ children }) => {
  return (
    <LMSThemeProvider>
      <LMSLayoutInner>{children}</LMSLayoutInner>
    </LMSThemeProvider>
  );
};

export default LMSLayout;
