import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AppScreenState {
  version: string;
  theme: string;
  refresh: boolean;
  errorMessage?: string[];
}

const initialState: AppScreenState = {
  version: '1.0.0',
  theme: 'light',
  refresh: false,
  errorMessage: [],
};

export const appScreenSlice = createSlice({
  name: 'appScreen',
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      state.refresh = !state.refresh;
    },
    refresh: (state) => {
      state.refresh = !state.refresh;
    },
    addErrorMessage: (state, action: PayloadAction<string>) => {
      if (!state.errorMessage) {
        state.errorMessage = [];
      }
      state.errorMessage.push(action.payload);
    },
  },
});

export const { setVersion, setTheme, refresh, addErrorMessage } = appScreenSlice.actions;

export default appScreenSlice.reducer;
