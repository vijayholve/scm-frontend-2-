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

// assets
import {
    IconLogout,
    IconCreditCard, // For ID Card icon
    IconArrowLeft,
    IconCalendar,
    IconFile,
    IconBriefcase, // For Tasks/Activity
    IconLock, // For password change
    IconEye,
    IconEyeOff
} from '@tabler/icons-react';

// project imports
import { userDetails } from 'utils/apiService'; // Using direct alias import
import ProfileHeader from 'ui-component/UserProfile/ProfileHeader'; // Assuming 'components' is also a root alias or direct path
import UserDetailsSection from 'ui-component/UserProfile/UserDetailsSection'; // Using direct alias import
import ActivitySection from 'ui-component/UserProfile/ActivitySection'; // Using direct alias import
import CollaborationSection from 'ui-component/UserProfile/CollaborationSection'; // Using direct alias import
import IDCardDisplay from 'ui-component/UserProfile/IDCardDisplay'; // Using direct alias import


// ==============================|| USER PROFILE PAGE ||============================== //

const UserProfile = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const user = userDetails.getUser();
    const [showIdCard, setShowIdCard] = useState(false); // State to control ID card visibility
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
        console.log('User Logged Out');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handlePasswordChange = () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        // TODO: Implement actual API call here
        console.log('Changing password for user:', user.userName);
        console.log('Old Password:', passwords.username);
        console.log('New Password:', passwords.newPassword);

        toast.success("Password changed successfully!");
        setOpenPasswordModal(false);
        setPasswords({ username: '', newPassword: '', confirmNewPassword: '' });
    };

    return (
        <>
            {/* Global Print Styles */}
            <style>
                {`
                @media print {
                    body > *:not(.id-card-to-print) {
                        display: none !important;
                    }
                    .id-card-to-print {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                    /* Hide the print button when printing */
                    .id-card-to-print + div button {
                        display: none !important;
                    }
                }
                `}
            </style>

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
                            display: 'none',
                        }
                    }}
                >
                    {/* Profile Header (extracted component) */}
                    <ProfileHeader user={user} onBack={handleBack} />

                    <Divider sx={{ width: '100%', mb: 3 }} />

                    {/* Navigation Links */}
                    <List component="nav" sx={{ width: '100%' }}>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setShowIdCard(false)}>
                            <ListItemText primary={<Typography variant="body1">Profile</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setShowIdCard(true)}>
                            <ListItemIcon>
                                <IconCreditCard stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">ID Card</Typography>} />
                        </ListItemButton>
                        {/* <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemIcon>
                                <IconBriefcase stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Tasks</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemI~con>
                                <IconCalendar stroke={1.5} size="1.3rem" />
                            </ListItemI~con>
                            <ListItemText primary={<Typography variant="body1">Calendar</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemIcon>
                                <IconFile stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Files</Typography>} />
                        </ListItemButton> */}
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }} onClick={() => setOpenPasswordModal(true)}>
                            <ListItemIcon>
                                <IconLock stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Change Password</Typography>} />
                        </ListItemButton>
                    </List>

                    <Divider sx={{ width: '100%', my: 3 }} />

                    {/* Logout Button */}
                    <ListItemButton
                        sx={{
                            borderRadius: `${customization.borderRadius}px`,
                            width: '100%',
                            mt: 'auto',
                            '&:hover': {
                                bgcolor: theme.palette.error.light,
                            }
                        }}
                        onClick={handleLogout}
                    >
                        <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" color={theme.palette.error.main} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" color="error">Logout</Typography>} />
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
                                minHeight: 'calc(100vh - 40px)',
                            }
                        }}
                    >
                        {/* Mobile Back Button (only visible on small screens) - now part of ProfileHeader */}
                        {/* Conditional Rendering of Profile Details or ID Card */}
                        {showIdCard ? (
                            <IDCardDisplay user={user} />
                        ) : (
                            <>
                                {/* User Details Section (extracted component) */}
                                <UserDetailsSection user={user} />

                                {/* "Nora spends most of their time on..." Section (extracted component) */}
                                <ActivitySection user={user} />

                                {/* "Works most with..." Section (extracted component) */}
                                <CollaborationSection user={user} />
                            </>
                        )}
                    </Paper>
                </Box>
            </Box>

            {/* Change Password Modal */}
            <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h4">Change Password for {user.userName}</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Old Password"
                        type={showUsername ? 'text' : 'password'}
                        value={passwords.username}
                        onChange={(e) => setPasswords({ ...passwords, username: e.target.value })}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowUsername(!showUsername)}
                                        edge="end"
                                    >
                                        {showUsername ? <IconEye /> : <IconEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <IconEye /> : <IconEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        value={passwords.confirmNewPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        edge="end"
                                    >
                                        {showConfirmNewPassword ? <IconEye /> : <IconEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
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
