import { Box, Button, Container, Stack, Typography, CircularProgress } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { decrement, increment, set } from '../store/slices/counterSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const counterValue = useAppSelector((s) => s.counter.value);
  const [loading, setLoading] = React.useState(true);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to ⚡ R.A.T.S ⚡
      </Typography>
      <Typography variant="h6" gutterBottom>
        The most dangerous cover band in the world.
      </Typography>
      <Box sx={{ mt: 4 }}>
        {/* <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Counter:</Typography>
          <Typography variant="h6">{counterValue}</Typography>
          <Button variant="contained" onClick={() => dispatch(increment())}>
            +
          </Button>
          <Button variant="outlined" onClick={() => dispatch(decrement())}>
            -
          </Button>
          <Button variant="text" onClick={() => dispatch(set(0))}>
            Reset
          </Button>
        </Stack> */}
        <Box sx={{ position: 'relative', minHeight: 450 }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.7)',
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <iframe
            width="100%"
            height="450"
            src="https://www.youtube.com/embed/f02GfloCijk"
            title="Just Breathe"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoading(false)}
            style={{ display: loading ? 'none' : 'block' }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
