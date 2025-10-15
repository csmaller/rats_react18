import { songsUrl } from '../../shared/utils/url';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Song {
  id: number;
  title: string;
  artist: string;
}

interface SongsState {
  songs: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: SongsState = {
  songs: [],
  loading: false,
  error: null,
};

export const fetchSongs = createAsyncThunk<Song[]>(
  'songs/fetchSongs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${songsUrl}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch songs');
    }
  }
);

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch songs';
      });
  },
});

export default songsSlice.reducer;
