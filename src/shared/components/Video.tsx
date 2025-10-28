import React from 'react';
import { Box ,Container,Typography} from '@mui/material';
import Loader from './Loader';
const Video: React.FC = () => {

    const [loading, setLoading] = React.useState(true);
    const url ='https://www.youtube.com/embed/LhsGpiRIk4A?autoplay=1&mute=1';
    const url2="https://www.youtube.com/embed/l46RV6Bt6dE?autoplay=1&mute=1"

  return (
    <Container sx={{ pt: { xs: 2, md: 6 }, px: { xs: 1, sm: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ mt: 1, display: 'flex', justifyContent: 'center', width: '100%', textAlign:"center", fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          Welcome to the most dangerous cover band in the world.
        </Typography>
        
        <Box component="div" sx={{ mt: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'center', width: '100%', alignItems: 'center', gap: { xs: 2, lg: 4 } }}>
          <Typography variant="body1" gutterBottom sx={{ pl: { xs: 1, sm: 4 }, pr: { xs: 1, sm: 4 }, fontSize: { xs: '0.9rem', sm: '1rem' }, maxWidth: { lg: '50%' } }}>
          We have been playing in and around Utah, California,Colorado, Wyoming, Nevada and Idaho since 2008. Our music comes from almost every popular genre and can be best described as “Ski Town Party Music”, but that doesn’t mean we don’t make your wedding, corporate event, or party a complete success!

          <p>With tons of songs, medleys, contagious energy, a touch of humor, and positive vibes RATS has built a name for themselves in their home town of Park City as one of the best bands in the area. Come down to one of our shows and see what all of the fuss is about.</p>
        </Typography>
          <Box sx={{ mt: { xs: 2, lg: 4 } }}>
            <Box sx={{ position: 'relative', minHeight: { xs: 250, sm: 350, md: 500 }, width: { xs: '100%', sm: 350, md: 400 }, maxWidth: '100%' }}>
              {loading && <Loader />}
              <iframe
                width="100%"
                height="100%"
                src={url}
                title="RATS - The Most Dangerous Cover Band in the World (Official Video)"
                frameBorder={0}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoading(false)}
                style={{ display: loading ? 'none' : 'block', minHeight: '250px' }}
              />
            </Box>
          </Box>
        
        </Box>
      </Container>
  );
};

export default Video;