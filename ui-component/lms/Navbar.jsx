import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, useTheme, Tooltip } from '@mui/material';
import { Menu as MenuIcon, AccountCircle, ExitToApp, Dashboard, School, LightMode, DarkMode } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLMSTheme } from '../../contexts/LMSThemeContext';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useLMSTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const navItems = [
    { label: 'Home', path: '/lms' },
    { label: 'Courses', path: '/lms/courses' },
    { label: 'About', path: '/lms/about' }
  ];

  if (userType === 'enrolled' || userType === 'user') {
    navItems.push({ label: 'Dashboard', path: '/dashboard/default' });
  }

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/lms')}
          >
            KoolERP
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right side - Theme toggle + User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          {userType === 'guest' ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <>
              <IconButton size="large" onClick={handleMenu} sx={{ color: theme.palette.text.primary }}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`
                  }
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard/default');
                  }}
                  sx={{ color: theme.palette.text.primary }}
                >
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
