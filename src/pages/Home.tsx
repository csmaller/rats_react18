import { Box, Button, Container, Stack, Typography, Divider } from '@mui/material';
import React, { forwardRef, useRef, useEffect } from 'react';
import Loader from '../shared/components/Loader';

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          The most dangerous cover band in the world.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ position: 'relative', minHeight: 450 }}>
            {loading && <Loader />}
            <iframe
              width="100%"
              height="450"
              src="https://www.youtube.com/embed/f02GfloCijk?autoplay=1&mute=1"
              title="RATS - The Most Dangerous Cover Band in the World (Official Video)"
              frameBorder={0}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
