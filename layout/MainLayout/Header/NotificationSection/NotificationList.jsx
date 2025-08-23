import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from '@mui/material';

// third-party
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// project imports
import { userDetails } from 'utils/apiService';

// assets
import { 
    IconUser, 
    IconSchool, 
    IconBook, 
    IconClipboardList, 
    IconUsers,
    IconFileText 
} from '@tabler/icons-react';

// extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// Helper function to map entity types to icons and colors
const getNotificationConfig = (entityType, theme) => {
    switch (entityType?.toUpperCase()) {
        case 'STUDENT':
            return {
                icon: <IconUser stroke={1.5} size="1.3rem" />,
                color: theme.palette.primary.dark,
                bgColor: theme.palette.primary.light
            };
        case 'TEACHER':
            return {
                icon: <IconUsers stroke={1.5} size="1.3rem" />,
                color: theme.palette.secondary.dark,
                bgColor: theme.palette.secondary.light
            };
        case 'ASSIGNMENT':
            return {
                icon: <IconClipboardList stroke={1.5} size="1.3rem" />,
                color: theme.palette.success.dark,
                bgColor: theme.palette.success.light
            };
        case 'SCHOOL':
            return {
                icon: <IconSchool stroke={1.5} size="1.3rem" />,
                color: theme.palette.warning.dark,
                bgColor: theme.palette.warning.light
            };
        case 'EXAM':
            return {
                icon: <IconFileText stroke={1.5} size="1.3rem" />,
                color: theme.palette.error.dark,
                bgColor: theme.palette.error.light
            };
        default:
            return {
                icon: <IconBook stroke={1.5} size="1.3rem" />,
                color: theme.palette.grey[700],
                bgColor: theme.palette.grey[100]
            };
    }
};

// Helper to format the message
const formatNotificationMessage = (notification) => {
    const { entityType, action, user, entityName } = notification;
    // Assuming the 'user' field in the notification log contains the name of the user who made the change.
    const userName = user || 'A user';
    const actionText = action ? action.toLowerCase().replace(/_/g, ' ') : 'modified';
        
    return `${userName} ${actionText} a record in ${entityType || 'the system'}.with name ${entityName}`;
};

const ListItemWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'primary.light'
        },
        '& .MuiListItem-root': {
            padding: 0
        }
      }}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notificationList = [] }) => {
    const theme = useTheme();
  
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                }
            }}
        >
            {notificationList.map((notification) => {
                const config = getNotificationConfig(notification.entityType, theme);
                const message = formatNotificationMessage(notification);
                const timeAgo = notification.createdAt ? dayjs(notification.createdAt).fromNow() : '';

                return (
                    <ListItemWrapper key={notification.id}>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <Avatar sx={{ color: `${config.color} !important`, bgcolor: config.bgColor }}>
                                    {config.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={<Typography variant="subtitle1">{notification.entityType}</Typography>} 
                                secondary={
                                    <Typography variant="caption" display="block" gutterBottom>
                                        {message} - {timeAgo}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </ListItemWrapper>
                );
            })}
        </List>
    );
};

NotificationList.propTypes = {
    notificationList: PropTypes.array
};

export default NotificationList;