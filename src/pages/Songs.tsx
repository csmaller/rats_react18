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
    <Box sx={{overflowY: 'auto', height: '100%', pb:6}}>
      <Typography variant="h4" component="h1" gutterBottom>
        Songs Page
      </Typography>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {displaySongs.map((song: any, idx: number) => (
            <Grid item xs={12} sm={6} md={4} key={song.id || idx}>
              <Card>
                <CardContent>
                  <Typography variant="body1">{song.title} - {song.artist}</Typography>
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
