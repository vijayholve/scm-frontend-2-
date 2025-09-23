import { useSelector } from 'react-redux';
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

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <ToastContainer />
        <NavigationScroll>
          <DataCacheProvider>
            <SelectorProvider>
              <RouterProviderWrapper />
            </SelectorProvider>
          </DataCacheProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
