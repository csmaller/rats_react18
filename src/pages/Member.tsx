import { Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BandNav from '../shared/components/BandNav';
import { memberUrl } from '../shared/utils/url';

type MemberProfile = {
  name: string;
  instruments: string;
  bio: string;
  photos: string[];
};

export default function Member() {
  const { slug = '' } = useParams();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    setMember(null);
    setMissing(false);

    fetch(memberUrl(slug))
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data: MemberProfile) => {
        if (active) {
          setMember({
            name: data.name,
            instruments: data.instruments ?? '',
            bio: data.bio ?? '',
            photos: Array.isArray(data.photos) ? data.photos : [],
          });
        }
      })
      .catch(() => {
        if (active) {
          setMissing(true);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const paragraphs = (member?.bio ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <BandNav />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        {missing && (
          <Typography align="center" color="text.secondary">
            That member is not on the lineup.
          </Typography>
        )}
        {member && (
          <>
            <Typography variant="h3" component="h1">
              {member.name}
            </Typography>
            {member.instruments && (
              <Typography align="center" sx={{ mt: 1 }} color="text.secondary">
                {member.instruments}
              </Typography>
            )}
            {paragraphs.map((paragraph) => (
              <Typography key={paragraph.slice(0, 48)} sx={{ mt: 2 }}>
                {paragraph}
              </Typography>
            ))}
            {member.photos.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: 2,
                }}
              >
                {member.photos.map((photo) => (
                  <Box
                    key={photo}
                    component="img"
                    src={photo}
                    alt=""
                    sx={{
                      width: '100%',
                      aspectRatio: '3 / 4',
                      objectFit: 'cover',
                      display: 'block',
                      border: '2px solid',
                      borderColor: 'secondary.main',
                    }}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
