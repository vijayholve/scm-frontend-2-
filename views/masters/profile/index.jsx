// vijayholve/scm-frontend-2-/scm-frontend-2--99de9307ae1a364fb21e20fbb2fb04cd318f2064/views/masters/profile/index.jsx

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
import Input from '@mui/material/Input'; // <-- NEW: Imported Input for file upload
import { BottomNavigation, BottomNavigationAction } from '@mui/material'; // <-- Already imported in original file

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
  IconUser,
  IconEdit // <-- NEW: Imported IconEdit
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
import {useTranslation} from "react-i18next";


const UserProfile = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const navigate = useNavigate();
  const { t } = useTranslation('profile');
  // NOTE: User data must be set in state to allow dynamic updates (like DOB)
  const rawUser = userDetails.getUser();
  const [user, setUser] = useState({
      ...rawUser,
      // Mock data for initial testing. Replace with actual data retrieval.
      // If dob is null/undefined, the "Add Birthday" button will show.
      dob: rawUser?.dob || '1995-10-21',
  });

  const userRole = user?.type?.toUpperCase();

  const [activeTab, setActiveTab] = useState('profile');
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  
  // NEW: State for Birthday Modal and Input
  const [openBirthdayModal, setOpenBirthdayModal] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState(user.dob || '');
  
  // NEW: State for Picture Modal and Input
  const [openPictureModal, setOpenPictureModal] = useState(false);
  const [selectedPictureFile, setSelectedPictureFile] = useState(null);

  const [passwords, setPasswords] = useState({
    username: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showUsername, setShowUsername] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const fileInputRef = useRef(null);

  // --- New Handlers ---

  const handleEditPicture = () => {
      setOpenPictureModal(true);
  };
  
  const handlePictureFileChange = (event) => {
    setSelectedPictureFile(event.target.files[0]);
  };
  


  const handleOpenBirthdayModal = () => {
      // Set the input field to the current user DOB (formatted for date input: YYYY-MM-DD)
      setBirthdayInput(user.dob ? new Date(user.dob).toISOString().substring(0, 10) : ''); 
      setOpenBirthdayModal(true);
  };
  
  const handleSaveBirthday = () => {
      if (!birthdayInput) {
          toast.error('Please enter a date.');
          return;
      }
      
      // TODO: Integrate actual API call here (e.g., PUT /api/users/update) to save the birthday.
      
      // Update local user state on success
      setUser(prev => ({ ...prev, dob: birthdayInput }));
      toast.success('Birthday saved successfully!');
      setOpenBirthdayModal(false);
  };
  // --- End New Handlers ---
  

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
            <UserDetailsSection user={user} onEditBirthday={handleOpenBirthdayModal} /> 
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
      case 'my-exams':
        return userRole === 'STUDENT' ? <StudentExamsList studentId={user.id} /> : 
        <Typography> 
          {t('messageExamsNotAvailable')}
        </Typography>;
      case 'my-documents':
        return <MyDocuments />;
      default:
        return <Typography>{t('messageContentNotFound')}</Typography>;
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
          {/* Passing onEditPicture to ProfileHeader */}
          <ProfileHeader user={user} onBack={handleBack} onEditPicture={handleEditPicture} /> 
          <Divider sx={{ width: '100%', mb: 3 }} />
          <List component="nav" sx={{ width: '100%' }}>
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('profile')}>
              <ListItemIcon>
                <IconHome stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">{t('labelProfile')}</Typography>} />
            </ListItemButton>
            {userRole === 'STUDENT' && (
              <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('my-exams')}>
                <ListItemIcon>
                  <IconAward stroke={1.5} size="1.3rem" />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body1">{t('labelMyExams')}</Typography>} />
              </ListItemButton>
            )}
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setActiveTab('my-documents')}>
              <ListItemIcon>
                <IconFileText stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">{t('labelmyDocuments')}</Typography>} />
            </ListItemButton>
            <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setOpenPasswordModal(true)}>
              <ListItemIcon>
                <IconLock stroke={1.5} size="1.3rem" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body1">{t('labelChangePassword')}</Typography>} />
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
                  {t('labelLogout')}
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
      {/* Bottom Navigation for Mobile (Unchanged) */}
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
          <BottomNavigationAction label={t('labelProfile')} value="profile" icon={<IconUser />} />
          {userRole === 'STUDENT' && <BottomNavigationAction label={t('labelExams')} value="my-exams" icon={<IconAward />} />}
          <BottomNavigationAction label={t('labelDocuments')} value="my-documents" icon={<IconFileText />} />
          <BottomNavigationAction label={t('labelPassword')} value="change-password" icon={<IconLock />} />
          <BottomNavigationAction label={t('labelLogout')} value="logout" icon={<IconLogout />} />
        </BottomNavigation>
      </Paper>

      {/* Change Password Modal (Unchanged) */}
      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h4">{t('labelChangePassword')} {t('labelFor')} {user.userName}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label= {t('labelCurrentPassword')}
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
                label={t('labelNewPassword')}
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
                label={t('labelConfirmNewPassword')}
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
          <Button onClick={() => setOpenPasswordModal(false)}>{t('labelCancel')}</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            {t('labelSaveChanges')}
          </Button>
        </DialogActions>
      </Dialog>
      
   
    </>
  );
};

export default UserProfile;