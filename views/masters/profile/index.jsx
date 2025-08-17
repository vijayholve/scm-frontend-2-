import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

// assets
import {
    IconLogout,
    IconCreditCard, // For ID Card icon
    IconArrowLeft,
    IconCalendar,
    IconFile,
    IconBriefcase, // For Tasks/Activity
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

    const handleLogout = () => {
        localStorage.removeItem('SCM-AUTH');
        navigate('/login');
        console.log('User Logged Out');
    };

    const handleBack = () => {
        navigate(-1);
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
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemIcon>
                                <IconBriefcase stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Tasks</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemIcon>
                                <IconCalendar stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Calendar</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemIcon>
                                <IconFile stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">Files</Typography>} />
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
        </>
    );
};

export default UserProfile;
