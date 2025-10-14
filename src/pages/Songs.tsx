import { Typography, Card, CardContent, Grid, CircularProgress, Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchSongs } from '../store/slices/songsSlice';
import songsData from '../data/songs.json';

const Songs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { songs, loading, error } = useSelector((state: RootState) => state.songs);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  // Fallback to local songs.json if API fails
  const displaySongs = songs.length > 0 ? songs : songsData.songs;

  return (
    <Box sx={{ height: '100%', pb: 6 }}>
      <Box sx={{ mb: 2, justifyContent: 'center', display: 'flex', pt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Songs
        </Typography>
      </Box>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}  sx={{overflowY: 'auto'}}>
          {displaySongs.map((song: any, idx: number) => (
            <Grid item xs={12} sm={6} md={4} key={song.id || idx}>
              <Card>
                <CardContent sx={{ paddingBottom: '8px !important', paddingTop: '8px !important' }}>
                  <Typography variant="body1">
                    {song.title} - {song.artist}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Songs;
