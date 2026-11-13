import { Box, Container, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MemberPhotoLink, { memberPath } from './MemberPhotoLink';
import { epkUrl, mainVideoUrl } from '../utils/url';

type MainVideo = {
  title: string;
  url: string;
};

type LineupPhoto = {
  name: string;
  slug: string;
  photo: string | null;
};

export default function Video() {
  const [video, setVideo] = useState<MainVideo | null>(null);
  const [photos, setPhotos] = useState<LineupPhoto[]>([]);

  useEffect(() => {
    let active = true;

    fetch(mainVideoUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { video: MainVideo | null }) => {
        if (active) {
          setVideo(data.video);
        }
      })
      .catch(() => {
        if (active) {
          setVideo(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetch(epkUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { lineup?: LineupPhoto[] }) => {
        if (!active) {
          return;
        }
        const portraits = (Array.isArray(data.lineup) ? data.lineup : [])
          .filter((member) => Boolean(member.photo) && Boolean(member.slug))
          .slice(0, 4);
        setPhotos(portraits);
      })
      .catch(() => {
        if (active) {
          setPhotos([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box component="section" id="media" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        {video ? (
          <Box
            sx={{
              border: '3px solid',
              borderColor: 'secondary.main',
              borderRadius: 2,
              overflow: 'hidden',
              lineHeight: 0,
            }}
          >
            <Box
              component="video"
              src={video.url}
              title={video.title}
              controls
              playsInline
              preload="metadata"
              sx={{ width: '100%', display: 'block', backgroundColor: '#000' }}
            />
          </Box>
        ) : (
          <Typography align="center" color="text.secondary">
            The main video shows up here after it is uploaded in the admin.
          </Typography>
        )}
        <Typography align="center" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/media" color="secondary">
            Media
          </Link>
        </Typography>
        {photos.length > 0 && (
          <Box
            sx={{
              mt: 5,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: { xs: 1, sm: 2 },
            }}
          >
            {photos.map((member) => (
              <Box key={member.slug}>
                {member.photo && (
                  <MemberPhotoLink slug={member.slug} photo={member.photo} alt={member.name} rounded />
                )}
                <Typography component="small" sx={{ display: 'block', mt: 0.75, fontSize: '0.75rem', textAlign: 'center' }}>
                  <Link component={RouterLink} to={memberPath(member.slug)} color="secondary">
                    {member.name}
                  </Link>
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
