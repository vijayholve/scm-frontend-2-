import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, useTheme } from '@mui/material';
import {
  IconUsers,
  IconReportAnalytics, // Dedicated icon for Reports
  IconSettings,
  IconFileText,
  IconUserCheck,
  IconUserCircle, // Dedicated icon for Account Management
  IconUserScan // Dedicated icon for Admin Tools/User Management
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const BackOfficeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path
  const theme = useTheme(); // To access the default theme colors

  // Sidebar menu items with unique icons
  const menuItems = [
    { id: 'admins', title: 'Users Dashboard', icon: <IconUsers />, url: '/backoffice/admins' },
    // suggest an icon for features
    { id: 'features', title: 'Features', icon: <IconReportAnalytics />, url: '/backoffice/features' },
    { id: 'institute', title: 'Institute', icon: <IconUserCircle />, url: '/backoffice/institute' },
    { id: 'school', title: 'School', icon: <IconUserCircle />, url: '/backoffice/school' },
    // { id: 'user-management', title: 'User Management', icon: <IconUserScan />, url: '/backoffice/user-management' },
    // { id: 'reports', title: 'Reports', icon: <IconReportAnalytics />, url: '/backoffice/reports' },
    // { id: 'settings', title: 'Settings', icon: <IconSettings />, url: '/backoffice/settings' },
    // { id: 'audit-logs', title: 'Audit Logs', icon: <IconFileText />, url: '/backoffice/audit-logs' },
    // { id: 'admin-tools', title: 'Admin Tools', icon: <IconUserCheck />, url: '/backoffice/admin-tools' }
  ];

  // Define the style for the active item
  const activeItemStyle = {
    color: theme.palette.primary.main, // Primary color for text
    backgroundColor: `${theme.palette.primary.main}10`, // Light primary background
    borderLeft: `3px solid ${theme.palette.primary.main}`, // Accent line
    fontWeight: 'bold',
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff', // Clean white background
          borderRight: 'none', // Remove the default border for a lighter look
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow
        }
      }}
    >
      <Box sx={{ padding: theme.spacing(3), paddingTop: theme.spacing(4) }}>
        <Typography
          variant="h5"
          align="left"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main, // Use primary color for branding
            // textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          BackOffice of KoolERP 

        </Typography>
      </Box>
      <Divider />
      <List sx={{ padding: theme.spacing(1) }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.url)}
              sx={{
                borderRadius: theme.shape.borderRadius,
                margin: theme.spacing(0.5, 1),
                padding: theme.spacing(1, 2),
                transition: 'background-color 0.2s',
                ...(isActive && activeItemStyle), // Apply active style if current path matches
                '&:hover': {
                  backgroundColor: isActive ? activeItemStyle.backgroundColor : '#f0f0f0',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: 40,
                color: isActive ? theme.palette.primary.main : theme.palette.text.secondary, // Icon color changes
                fontSize: 20
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default BackOfficeSidebar;