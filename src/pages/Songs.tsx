import { Typography, Card, CardContent, Grid } from '@mui/material';
import React from 'react';
import songsData from '../data/songs.json';


const Songs: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Songs Page
      </Typography>
      <Grid container spacing={2}>
        {songsData.songs.map((song: any, idx: number) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card>
              <CardContent>
                <Typography variant="h6">{song.title}</Typography>
                <Typography variant="body2">Artist: {song.artist}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Songs;
