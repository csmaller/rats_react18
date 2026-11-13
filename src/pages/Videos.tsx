import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoRat from '../assets/logo_rat.png';
import { videosUrl } from '../shared/utils/url';

type VideoLink = {
  title: string;
  url: string;
  embed_url: string;
};

export default function Videos() {
  const [videos, setVideos] = useState<VideoLink[]>([]);

  useEffect(() => {
    let active = true;

    fetch(videosUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { videos?: VideoLink[] }) => {
        if (active) {
          setVideos(Array.isArray(data.videos) ? data.videos : []);
        }
      })
      .catch(() => {
        if (active) {
          setVideos([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          backgroundColor: 'black',
          borderBottom: 3,
          borderColor: 'divider',
        }}
      >
        <MuiLink component={Link} to="/" aria-label="Back to main page" sx={{ display: 'inline-flex' }}>
          <Box component="img" src={logoRat} alt="" sx={{ height: { xs: 42, md: 52 }, width: 'auto' }} />
        </MuiLink>
      </Box>
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography variant="h3" component="h1">
          Videos
        </Typography>
        {videos.length === 0 ? (
          <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
            Videos show up here after they are added in the admin.
          </Typography>
        ) : (
          <Box
            component="ul"
            sx={{
              mt: 3,
              pl: 0,
              listStyle: 'none',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              justifyItems: 'center',
              gap: 3,
            }}
          >
            {videos.map((video) => (
              <Box key={video.embed_url} component="li" sx={{ width: '100%', maxWidth: 280 }}>
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: 'secondary.main',
                    borderRadius: 2,
                    overflow: 'hidden',
                    lineHeight: 0,
                    aspectRatio: '9 / 16',
                    backgroundColor: '#000',
                  }}
                >
                  <Box
                    component="iframe"
                    src={video.embed_url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                  />
                </Box>
                <Typography align="center" sx={{ mt: 1, fontSize: '0.95rem' }}>
                  {video.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
