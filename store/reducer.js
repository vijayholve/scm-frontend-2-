import { combineReducers } from 'redux';
import userReducer from './userSlice';

// reducer import
import customizationReducer from './customizationReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  user: userReducer
});

export default reducer;
