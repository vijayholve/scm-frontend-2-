import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import toast for user feedback

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    CardActions,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import apiService, { userDetails } from 'utils/apiService';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [notificationList, setNotificationList] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(5);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    
    // Function to fetch notifications
    const fetchNotifications = () => {
        const pagination = {
            page: 0,
            size: displayCount,
            sortBy: "id",
            sortDir: "desc",
            search: ""
        };
        apiService.post(`api/auditlogs/getAll/${userDetails.getAccountId()}`, pagination)
            .then(response => {
                setNotificationList(response.data.content || []);
                setRowCount(response.data.totalElements || 0);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if(open){
            fetchNotifications();
        }
    }, [open, displayCount]);

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        if (event?.target.value) setValue(event?.target.value);
    };
    
    const handleViewMore = () => {
        setDisplayCount(prevCount => prevCount + 5);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiService.post(`/api/auditlogs/markallread/${userDetails.getAccountId()}`);
            toast.success("All notifications marked as read.");
            // Refresh the list after marking as read
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            toast.error("Failed to mark notifications as read.");
        }
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">All Notification</Typography>
                                                        <Chip
                                                            size="small"
                                                            label={rowCount}
                                                            sx={{
                                                                color: theme.palette.background.default,
                                                                bgcolor: theme.palette.warning.dark
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                                <Grid item>
                                                    <Typography
                                                        variant="subtitle2"
                                                        color="primary"
                                                        onClick={handleMarkAllAsRead}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        Mark as all read
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                            >
                                                <NotificationList notificationList={notificationList} />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    {notificationList.length < rowCount && (
                                        <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                            <Button size="small" disableElevation onClick={handleViewMore}>
                                                View More
                                            </Button>
                                        </CardActions>
                                    )}
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;