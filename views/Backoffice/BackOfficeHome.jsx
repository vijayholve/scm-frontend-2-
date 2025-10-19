import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';

const BackOfficeHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/backoffice');
        break;
      case 1:
        navigate('/backoffice/account-management');
        break;
      case 2:
        navigate('/backoffice/user-management');
        break;
      case 3:
        navigate('/backoffice/reports');
        break;
      default:
        break;
    }
  };

  return (
    <MainLayout 
      title="Backoffice Console"
      description="Manage accounts, users, and view reports">
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="backoffice navigation tabs"
                sx={{ mb: 3 }}

            >
                <Tab label="Dashboard" />
                <Tab label="Account Management" />
                <Tab label="User Management" />
                <Tab label="Reports" />
            </Tabs>
        </Box>
    </MainLayout>
  );
};

export default BackOfficeHome;
