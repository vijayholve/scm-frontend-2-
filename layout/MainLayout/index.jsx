import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Fab from '@mui/material/Fab';
import Modal from '@mui/material/Modal'; // or use Drawer if you prefer

// project imports
import { CssBaseline, styled, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import { SET_MENU } from 'store/actions';
import { drawerWidth } from 'store/constant';
import ChatbotUI from 'views/ChatBot/ChatbotUI';
// assets
import { IconChevronRight } from '@tabler/icons-react';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawe
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('SCM-AUTH'));
    const isUserLoggedIn = authData?.accessToken ? true : false;
    if (!isUserLoggedIn) {
      navigate('/login');
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header   */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        {/* <Breadcrumbs separator={IconChevronRight} navigation={navigate} icon title rightAlign /> */}
        <Outlet />
      </Main>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}
          onClick={() => setChatOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Modal */}
      <Modal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sx={{ zIndex: 2100, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
      >
        <Box
          sx={{
            width: { xs: '100%', sm: 400 },
            height: { xs: '60%', sm: 600 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            m: 2,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="close"
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2200 }}
            onClick={() => setChatOpen(false)}
          >
            <CloseIcon />
          </Fab>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <ChatbotUI />
          </Box>
        </Box>
      </Modal>

      <Customization />
    </Box>
  );
};

export default MainLayout;
