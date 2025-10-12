// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import songsData from '../../data/songs.json';

// export interface Song {
//   id: number | string;
//   title: string;
//   artist: string;
// }

// interface SongsState {
//   songs: Song[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SongsState = {
//   songs: [],
//   loading: false,
//   error: null,
// };

// export const fetchSongs = createAsyncThunk<Song[]>('songs/fetchSongs', async (_, thunkAPI) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // simulate success
//       if (songsData && songsData.songs) {
//         const data: Song[] = songsData.songs;
//         const promise = new Promise<Song[]>((resolve) => resolve(data));

//         resolve(data);
//       } else resolve([] as Song[]);
//       // simulate failure (uncomment to test)
//       // reject(new Error('Failed to fetch data'));
//     }, 1500); // 1.5s delay
//   });

//   //TODO: used for real API
//   //    'songs/fetchSongs',
//   //   async (_, { rejectWithValue }) => {
//   //     try {
//   //       const response = await fetch('http://localhost:4000/songs');
//   //       if (!response.ok) throw new Error('Network response was not ok');
//   //       const data = await response.json();
//   //       return data;
//   //     } catch (err: any) {
//   //       return rejectWithValue(err.message || 'Failed to fetch songs');
//   //     }
//   //   }
// });

// const songsSlice = createSlice({
//   name: 'songs',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSongs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSongs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.songs = action.payload;
//       })
//       .addCase(fetchSongs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = (action.payload as string) || 'Failed to fetch songs';
//       });
//   },
// });

// export default songsSlice.reducer;

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

const url = 'https://68ebdb7ddcba6c8dcc71a524--ratsbackend.netlify.app/.netlify/functions/songs';

export const fetchSongs = createAsyncThunk<Song[]>(
  'songs/fetchSongs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
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
