import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';
import { userDetails } from 'utils/apiService';

// Initial state for the user slice from local storage
const storedUser = userDetails.getUser();


const initialState = {
  isLoggedIn: false,
  user: storedUser? storedUser : null,
  accessToken: null,
  role: null,
  permissions: userDetails.getPermissions() || []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogin(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.accessToken = action.payload?.accessToken || null;
      state.role = action.payload?.role || null;
      state.permissions = action.payload?.role?.permissions || [];
    },
    setLogout(state) {
      state.isLoggedIn = false;
      state.user = null;
    }
  }
});

export const { setLogin, setLogout } = userSlice.actions;
export default userSlice.reducer;