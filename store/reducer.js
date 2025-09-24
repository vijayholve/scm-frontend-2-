import { combineReducers } from 'redux';
import userReducer from './userSlice';

// reducer import
import customizationReducer from './customizationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  user: userReducer ,
  // Add any additional reducers here
  //scdData: scdDataReducer, // Example if you have a separate reducer for SCD data
  
});

export default reducer;
