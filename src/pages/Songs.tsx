import { Typography, Card, CardContent, Grid, CircularProgress, Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchSongs } from '../store/slices/songsSlice';
import songsData from '../data/songs.json';
import { songsPdfUrl } from '../shared/utils/url';


const Songs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { songs, loading, error } = useSelector((state: RootState) => state.songs);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  // Fallback to local songs.json if API fails
  const displaySongs = songs.length > 0 ? songs : songsData.songs;

  return (
    <Box sx={{ overflowY: 'auto',  height:"100%", pb: 6}}>
      <Box sx={{ mb: 2, justifyContent: 'center', display: 'flex', pt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Songs
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button component="a" href={songsPdfUrl} variant="outlined">
          Download Set List and Booking Information
        </Button>
      </Box>
      {loading && displaySongs.length === 0 ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      ) : displaySongs.length === 0 ? (
        <Typography color="error" align="center">{error || 'No songs on the set list yet.'}</Typography>
      ) : (
        <Grid container spacing={2}>
          {displaySongs.map((song: any, idx: number) => (
            <Grid item xs={12} sm={6} md={4} key={song.id || idx}>
              <Card>
                <CardContent sx={{ paddingBottom: '8px !important', paddingTop: '8px !important' }}>
                  <Typography sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
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
