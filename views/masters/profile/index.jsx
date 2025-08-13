import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'; // Added for the print button

// assets
import {
    IconLogout,
    IconMail,
    IconId,
    IconBook,
    IconPhone,
    IconMapPin,
    IconUserCircle,
    IconArrowLeft,
    IconBriefcase,
    IconLock,
    IconBug,
    IconCalendar,
    IconFile,
    IconCreditCard, // For ID Card icon
    IconPrinter // For Print icon
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| USER DETAILS SERVICE ||============================== //
const userDetails = {
    getUser: () => {
        try {
            const authData = localStorage.getItem('SCM-AUTH');
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                const userData = parsedAuth.data || {};

                return {
                    firstName: userData.firstName || 'Nora',
                    lastName: userData.lastName || 'Tsunoda',
                    role: {
                        name: userData.role?.name || parsedAuth.role?.name || 'Security Lead'
                    },
                    email: userData.email || 'nora.tsunoda@example.com',
                    mobile: userData.mobile || '9876543210', // Example mobile number
                    address: userData.address || '123 Main St, Anytown',
                    userName: userData.userName || 'NoraT',
                    studentId: userData.rollNo || 'STU-12345', // Example student ID
                    type: userData.type || 'STAFF',
                    timeSpentOn: [
                        { icon: <IconBriefcase />, text: "Product Infrastructure" },
                        { icon: <IconLock />, text: "Network Security" },
                        { icon: <IconBug />, text: "Security Testing" },
                        { icon: <IconBook />, text: "Security Audit Outsourcing" },
                        { icon: <IconBug />, text: "Bugs" },
                    ],
                    worksWith: [
                        { name: "Joe A.", avatar: "https://placehold.co/40x40/FF5733/FFFFFF?text=JA" },
                        { name: "Dylan C.", avatar: "https://placehold.co/40x40/33FF57/FFFFFF?text=DC" },
                        { name: "Ethan C.", avatar: "https://placehold.co/40x40/3357FF/FFFFFF?text=EC" },
                        { name: "Louis W.", avatar: "https://placehold.co/40x40/FF33A1/FFFFFF?text=LW" },
                        { name: "Jacob S.", avatar: "https://placehold.co/40x40/33FFF3/FFFFFF?text=JS" },
                        { name: "Julia B.", avatar: "https://placehold.co/40x40/A133FF/FFFFFF?text=JB" },
                    ]
                };
            }
        } catch (error) {
            console.error("Error parsing SCM-AUTH from localStorage:", error);
        }
        return {
            firstName: "Guest", lastName: "User", role: { name: "Guest" },
            email: "guest@example.com", mobile: "N/A", address: "N/A", userName: "GuestUser",
            studentId: "N/A", type: "GUEST", timeSpentOn: [], worksWith: []
        };
    },
    getAccountId: () => {
        try {
            const authData = localStorage.getItem('SCM-AUTH');
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                return parsedAuth.role?.accountId || parsedAuth.data?.accountId || null;
            }
        } catch (error) {
            console.error("Error parsing SCM-AUTH accountId from localStorage:", error);
        }
        return null;
    }
};

// ==============================|| ID CARD COMPONENT ||============================== //
const IDCard = ({ user }) => {
    const theme = useTheme();
    const idCardRef = useRef(null);

    const handlePrint = () => {
        const printContent = idCardRef.current;
        const originalContents = document.body.innerHTML;
        const printArea = printContent.outerHTML;

        // Temporarily replace body content with the ID card for printing
        document.body.innerHTML = printArea;
        document.body.style.margin = '0'; // Remove body margin for print
        document.body.style.padding = '0'; // Remove body padding for print

        window.print();

        // Restore original content after printing
        document.body.innerHTML = originalContents;
        document.body.style.margin = '';
        document.body.style.padding = '';
        window.location.reload(); // Reload to ensure all scripts and styles are re-applied correctly
    };

    return (
        <MainCard title="User ID Card" sx={{ mb: 4 }}>
            <Box
                ref={idCardRef}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    p: 3,
                    maxWidth: 400, // Fixed width for ID card look
                    margin: 'auto',
                    boxShadow: theme.shadows[3],
                    bgcolor: theme.palette.background.paper,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    '@media print': { // Styles specifically for printing
                        border: 'none',
                        boxShadow: 'none',
                        p: 0,
                        width: '100%', // Take full width on print
                        maxWidth: 'none',
                        margin: 0,
                        display: 'block', // Ensure block display for print layout
                        pageBreakAfter: 'always', // Ensures each ID card (if multiple) prints on new page
                    }
                }}
                className="id-card-to-print" // Add a class for print CSS targeting
            >
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                        fontSize: '3rem',
                        border: `2px solid ${theme.palette.primary.main}`,
                        mb: 1,
                        '@media print': {
                            border: '1px solid #ccc',
                            boxShadow: 'none',
                        }
                    }}
                    alt="User Avatar"
                >
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {user?.role?.name || 'N/A'}
                </Typography>

                <Divider sx={{ width: '80%', my: 1, '@media print': { my: 0.5 } }} />

                <Stack spacing={0.5} sx={{ width: '100%', px: 2, '@media print': { px: 0 } }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconId stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
                        <Typography variant="body2">ID: {user?.studentId || 'N/A'}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconMail stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
                        <Typography variant="body2">Email: {user?.email || 'N/A'}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconPhone stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
                        <Typography variant="body2">Mobile: {user?.mobile || 'N/A'}</Typography>
                    </Stack>
                </Stack>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<IconPrinter />}
                    onClick={handlePrint}
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            bgcolor: theme.palette.primary.dark
                        }
                    }}
                >
                    Print ID Card
                </Button>
            </Box>
        </MainCard>
    );
};

// ==============================|| USER PROFILE PAGE ||============================== //

const UserProfile = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();

    const user = userDetails.getUser();
    const [showIdCard, setShowIdCard] = useState(false); // State to control ID card visibility

    const handleLogout = async () => {
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
                    {/* Back Button */}
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <IconButton onClick={handleBack} aria-label="go back">
                            <IconArrowLeft />
                        </IconButton>
                    </Box>

                    {/* Profile Avatar and Name */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.text.primary,
                                fontSize: '3rem',
                                border: `3px solid ${theme.palette.primary.main}`,
                                boxShadow: theme.shadows[8],
                                mx: 'auto',
                                mb: 2,
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                            alt="User Avatar"
                        >
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.role?.name || 'N/A'}
                        </Typography>
                    </Box>

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
                            <ListItemText primary={<Typography variant="body1">Tasks</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
                            <ListItemText primary={<Typography variant="body1">Calendar</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px`, mb: 1 }}>
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
                        {/* Mobile Back Button (only visible on small screens) */}
                        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                            <IconButton onClick={handleBack} aria-label="go back">
                                <IconArrowLeft />
                            </IconButton>
                        </Box>

                        {/* Conditional Rendering of Profile Details or ID Card */}
                        {showIdCard ? (
                            <IDCard user={user} />
                        ) : (
                            <>
                                {/* User Details Section */}
                                <MainCard title="User Details" sx={{ mb: 4 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <IconUserCircle stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Username: <Typography component="span" variant="subtitle2" color="text.primary">{user?.userName || 'N/A'}</Typography>
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <IconMail stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Email: <Typography component="span" variant="subtitle2" color="text.primary">{user?.email || 'N/A'}</Typography>
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <IconPhone stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Mobile: <Typography component="span" variant="subtitle2" color="text.primary">{user?.mobile || 'N/A'}</Typography>
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <IconMapPin stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Address: <Typography component="span" variant="subtitle2" color="text.primary">{user?.address || 'N/A'}</Typography>
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {/* Student-specific data */}
                                            {user.type === 'STUDENT' && (
                                                <Stack spacing={1}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <IconId stroke={1.5} size="1.1rem" color={theme.palette.grey[600]} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Student ID: <Typography component="span" variant="subtitle2" color="text.primary">{user?.studentId || 'N/A'}</Typography>
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            )}
                                        </Grid>
                                    </Grid>
                                </MainCard>

                                {/* "Nora spends most of their time on..." Section */}
                                {user.timeSpentOn && user.timeSpentOn.length > 0 && (
                                    <MainCard title="Nora spends most of their time on..." sx={{ mb: 4 }}>
                                        <Grid container spacing={1}>
                                            {user.timeSpentOn.map((item, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        {item.icon}
                                                        <Typography variant="body2">{item.text}</Typography>
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </MainCard>
                                )}

                                {/* "Works most with..." Section */}
                                {user.worksWith && user.worksWith.length > 0 && (
                                    <MainCard title="Works most with...">
                                        <Stack direction="row" flexWrap="wrap" spacing={2}>
                                            {user.worksWith.map((person, index) => (
                                                <Stack key={index} alignItems="center" spacing={0.5}>
                                                    <Avatar src={person.avatar} alt={person.name} sx={{ width: 48, height: 48 }} />
                                                    <Typography variant="caption" sx={{ textAlign: 'center' }}>{person.name}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </MainCard>
                                )}
                            </>
                        )}
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default UserProfile;
