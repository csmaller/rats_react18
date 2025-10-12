import { Box, Button, Container, Stack, Typography, Divider } from '@mui/material';
import React, {useRef, useEffect} from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import Loader from '../components/Loader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchSongs } from '../store/slices/songsSlice';

const Home: React.FC = () => {
  const home = useRef(null);
  //const [loading, setLoading] = React.useState(true);

    const dispatch = useDispatch<AppDispatch>();
    const { songs, loading, error } = useSelector((state: RootState) => state.songs);
  
    useEffect(() => {
      dispatch(fetchSongs());
    }, [dispatch]);
  

  return (
    <>
    <Container sx={{ mt: 4 }} ref={home}>
      <Typography variant="h3" gutterBottom>
       Rage Against The Supremes
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
            <Loader />
          )}
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
