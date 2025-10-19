// src/views/masters/profile/index.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';

// assets
import {
  IconLogout,
  IconCreditCard,
  IconArrowLeft,
  IconFile,
  IconLock,
  IconEye,
  IconEyeOff,
  IconFileText,
  IconAward,
  IconHome,
  IconReceipt2,
  IconUser
} from '@tabler/icons-react';

// project imports
import { userDetails } from 'utils/apiService';
import ProfileHeader from 'ui-component/UserProfile/ProfileHeader';
import UserDetailsSection from 'ui-component/UserProfile/UserDetailsSection';
import ActivitySection from 'ui-component/UserProfile/ActivitySection';
import CollaborationSection from 'ui-component/UserProfile/CollaborationSection';
import IDCardDisplay from 'ui-component/UserProfile/IDCardDisplay';

// New components for student profile
import StudentFeeDetails from './StudentFeeDetails';
import StudentExamsList from './StudentExamsList';
import MyDocuments from './MyDocuments';
import TeacherDetails from './TeacherDetails';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

const UserProfile = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();

  const user = userDetails.getUser();
  const userRole = user?.type?.toUpperCase();

  const [activeTab, setActiveTab] = useState('profile');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    username: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showUsername, setShowUsername] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('SCM-AUTH');
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    console.log('Changing password for user:', user.userName);
    console.log('Old Password:', passwords.username);
    console.log('New Password:', passwords.newPassword);

    toast.success('Password changed successfully!');
    setOpenPasswordModal(false);
    setPasswords({ username: '', newPassword: '', confirmNewPassword: '' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <UserDetailsSection user={user} />
            {userRole === 'STUDENT' && (
              <Box sx={{ mt: 4 }}>
                <StudentFeeDetails studentId={user.id} />
              </Box>
            )}
            {userRole === 'TEACHER' && (
              <Box sx={{ mt: 4 }}>
                <TeacherDetails user={user} />
              </Box>
            )}
            <ActivitySection user={user} />
            <CollaborationSection user={user} />
          </>
        );
      // case 'id-card':
      //   return <IDCardDisplay user={user} />;
      case 'my-exams':
        return userRole === 'STUDENT' ? <StudentExamsList studentId={user.id} /> : <Typography>Not Applicable</Typography>;
      case 'my-documents':
        return <MyDocuments />;
      default:
        return <Typography>Content not found.</Typography>;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          padding: theme.spacing(4),
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
          }
        }}
      >
        {/* Left Sidebar / Profile Navigation */}
        <Paper
          elevation={3}
          sx={{
            width: 280,
            minWidth: 280,
            borderRadius: `${customization.borderRadius}px`,
            p: 3,
            mr: 4,
            bgcolor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
              display: 'none'
            }
          }}
        >
          <ProfileHeader user={user} onBack={handleBack} />
          <Divider sx={{ width: '100%', mb: 3 }} />
          <List component="nav" sx={{ width: '100%' }}>
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('profile')}>
              <ListItemIcon>
                <IconHome stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">Profile</Typography>} />
            </ListItemButton>
            {/* <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('id-card')}>
              <ListItemIcon>
                <IconCreditCard stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">ID Card</Typography>} />
            </ListItemButton> */}
            {userRole === 'STUDENT' && (
              <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('my-exams')}>
                <ListItemIcon>
                  <IconAward stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1">My Exams</Typography>} />
              </ListItemButton>
            )}
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('my-documents')}>
              <ListItemIcon>
                <IconFileText stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">My Documents</Typography>} />
            </ListItemButton>
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setOpenPasswordModal(true)}>
              <ListItemIcon>
                <IconLock stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">Change Password</Typography>} />
            </ListItemButton>
          </List>
          <Divider sx={{ width: '100%', my: 3 }} />
          <ListItemButton
            sx={{
              borderRadius: `${customization.borderRadius}px`,
              width: '100%',
              mt: 'auto',
              '&:hover': {
                bgcolor: theme.palette.error.light
              }
            }}
            onClick={handleLogout}
          >
            <ListItemIcon>
              <IconLogout stroke={1.5} size="1.3rem" color={theme.palette.error.main} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" color="error">
                  Logout
                </Typography>
              }
            />
          </ListItemButton>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: `${customization.borderRadius}px`,
              p: 4,
              bgcolor: theme.palette.background.paper,
              minHeight: 'calc(100vh - 80px)',
              [theme.breakpoints.down('sm')]: {
                p: 2,
                minHeight: 'calc(100vh - 40px)'
              }
            }}
          >
            {renderContent()}
          </Paper>
        </Box>
      </Box>
      {/* Bottom Navigation for Mobile */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', md: 'none' },
          zIndex: 1100
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(event, newValue) => {
            if (newValue === 'change-password') {
              setOpenPasswordModal(true);
            } else if (newValue === 'logout') {
              handleLogout();
            } else {
              setActiveTab(newValue);
            }
          }}
        >
          <BottomNavigationAction label="Profile" value="profile" icon={<IconUser />} />
          {/* <BottomNavigationAction label="ID Card" value="id-card" icon={<IconCreditCard />} /> */}
          {userRole === 'STUDENT' && <BottomNavigationAction label="Exams" value="my-exams" icon={<IconAward />} />}
          <BottomNavigationAction label="Documents" value="my-documents" icon={<IconFileText />} />
          <BottomNavigationAction label="Password" value="change-password" icon={<IconLock />} />
          <BottomNavigationAction label="Logout" value="logout" icon={<IconLogout />} />
        </BottomNavigation>
      </Paper>

      {/* Change Password Modal */}
      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h4">Change Password for {user.userName}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Old Password"
                type={showUsername ? 'text' : 'password'}
                value={passwords.username}
                onChange={(e) => setPasswords({ ...passwords, username: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowUsername(!showUsername)} edge="end">
                        {showUsername ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        {showNewPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={passwords.confirmNewPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} edge="end">
                        {showConfirmNewPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
