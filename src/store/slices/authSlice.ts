//@redux-slice-template
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Mock API functions
const mockLoginApi = async (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'error') {
        reject('Invalid username');
      } else {
        resolve(username);
      }
    }, 1000);
  });
};

const mockLogoutApi = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};

// Async thunks
export const loginAsync = createAsyncThunk<string, string>(
  'auth/loginAsync',
  async (username, { rejectWithValue }) => {
    try {
      const user = await mockLoginApi(username);
      return user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logoutAsync = createAsyncThunk<void, void>(
  'auth/logoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      await mockLogoutApi();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // loginAsync
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      // logoutAsync
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Logout failed';
      });
  },
});

export default authSlice.reducer;
