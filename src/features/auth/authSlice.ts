// src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, TokenResponse } from './authType';

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsSet: (state, action: PayloadAction<TokenResponse>) => {
      const { accessToken, userId, universityEmail, fullName, role } = action.payload;
      state.accessToken = accessToken;
      state.user = { id: userId, universityEmail, fullName, role };
    },
    loggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { credentialsSet, loggedOut } = authSlice.actions;
export default authSlice.reducer;
