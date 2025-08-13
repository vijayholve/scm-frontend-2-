import { createRoot } from 'react-dom/client';
// third party
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// project imports 
import App from './App';
import reducer from './store/reducer';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// style + assets
import 'assets/scss/style.scss';
import reportWebVitals from 'reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container); 
const store = configureStore({ reducer });
// ==============================|| REACT DOM RENDER  ||============================== //

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();