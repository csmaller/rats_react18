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
const mockLoginApi = async (credentials: Credentials): Promise<string> => {
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'password123';

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username !== ADMIN_USERNAME && credentials.password !== ADMIN_PASSWORD) {
        reject('Invalid credentials.Try again');
      } else {
        resolve(credentials.username);
      }
    }, 100);
  });
};

const mockLogoutApi = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};

interface Credentials {
  username: string;
  password: string;
}

// Async thunks
export const login = createAsyncThunk<string, Credentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (credentials.username.trim() === '' || credentials.password.trim() === '') {
        return rejectWithValue('Username and password are required');
      }
      const user = await mockLoginApi(credentials);
      return user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      // logoutAsync
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Logout failed';
      });
  },
});

export default authSlice.reducer;
