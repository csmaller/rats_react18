import React from 'react';
import { Box ,Container,Typography} from '@mui/material';
import Loader from './Loader';
const Video: React.FC = () => {

    const [loading, setLoading] = React.useState(true);

  return (
    <Container sx={{ pt: 6 }}>
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
  );
};

export default Video;