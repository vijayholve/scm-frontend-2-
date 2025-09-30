import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import router from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import 'react-toastify/dist/ReactToastify.css';
import RouterProviderWrapper from 'routes';
import { DataCacheProvider } from './contexts/DataCacheContext';
import { SelectorProvider } from './contexts/SelectorContext'; // Use this instead
import { SCDProvider } from 'contexts/SCDProvider';
import { fetchScdData } from 'store/scdSlice';
import { userDetails } from 'utils/apiService';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    // Prefer redux user.accountId if available; fall back to token-stored accountId
    const accountId = user?.accountId || userDetails.getAccountId();
    if (accountId) {
      dispatch(fetchScdData());
    }
  }, [dispatch, user?.accountId]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <NavigationScroll>
          <DataCacheProvider>
            <SelectorProvider>
              <SCDProvider>
              <RouterProviderWrapper />
              </SCDProvider>
            </SelectorProvider>
          </DataCacheProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};



export default App;