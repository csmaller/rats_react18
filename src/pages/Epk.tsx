import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoRat from '../assets/logo_rat.png';
import MemberPhotoLink, { memberPath } from '../shared/components/MemberPhotoLink';
import { epkUrl, songsPdfUrl } from '../shared/utils/url';

type ListenLink = {
  title: string;
  url: string;
};

type LineupMember = {
  name: string;
  slug: string;
  instruments: string;
  bio: string;
  photo: string | null;
};

type Booking = {
  manager: string | null;
  email: string | null;
  phone: string | null;
};

const sectionLabel = {
  textAlign: 'left',
  fontSize: '1.1rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  lineHeight: 1.2,
};

export default function Epk({ embedded = false }: { embedded?: boolean }) {
  const [biography, setBiography] = useState('');
  const [lineup, setLineup] = useState<LineupMember[]>([]);
  const [listen, setListen] = useState<ListenLink[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let active = true;

    fetch(epkUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { biography?: string; lineup?: LineupMember[]; listen?: ListenLink[]; booking?: Booking | null }) => {
        if (!active) {
          return;
        }
        setBiography(data.biography ?? '');
        setLineup(Array.isArray(data.lineup) ? data.lineup : []);
        setListen(Array.isArray(data.listen) ? data.listen : []);
        setBooking(data.booking ?? null);
      })
      .catch(() => {
        if (active) {
          setListen([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const paragraphs = biography
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Box sx={{ minHeight: embedded ? 0 : '100vh' }}>
      {!embedded && (
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
      )}
      <Container maxWidth="md" sx={{ py: embedded ? { xs: 4, md: 6 } : { xs: 5, md: 8 } }}>
        <Typography variant="h3" component="h1">
          Electronic Press Kit
        </Typography>
        <Typography component="h2" sx={{ ...sectionLabel, mt: 4 }}>
          Biography
        </Typography>
        {paragraphs.map((paragraph) => (
          <Typography key={paragraph.slice(0, 40)} sx={{ mt: 2 }}>
            {paragraph}
          </Typography>
        ))}
        <Typography sx={{ mt: 2 }}>
          <MuiLink href={songsPdfUrl} color="secondary">
            Download Set List and Booking Information
          </MuiLink>
        </Typography>
        {lineup.length > 0 && (
          <Box component="section" sx={{ mt: 6 }}>
            <Typography component="h2" sx={sectionLabel}>
              Lineup
            </Typography>
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
              {lineup.map((member) => (
                <Box
                  key={`${member.name}-${member.instruments}`}
                  component="li"
                  sx={{ width: '100%', maxWidth: 280, textAlign: 'center' }}
                >
                  {member.photo && member.slug && (
                    <MemberPhotoLink slug={member.slug} photo={member.photo} alt={member.name} />
                  )}
                  <Typography sx={{ mt: 1 }}>{member.name}</Typography>
                  {member.slug && (
                    <Typography sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                      <MuiLink component={Link} to={memberPath(member.slug)} color="secondary">
                        see more pictures of {member.name}
                      </MuiLink>
                    </Typography>
                  )}
                  {member.instruments && (
                    <Typography sx={{ mt: 0.25, fontSize: '0.8rem', lineHeight: 1.15 }} color="text.secondary">
                      {member.instruments}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {listen.length > 0 && (
          <Box component="section" sx={{ mt: 6 }}>
            <Typography variant="h3" component="h2">
              Listen
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 3 }}>
              {listen.map((link) => (
                <Typography key={link.url} component="li" sx={{ mb: 1 }}>
                  <MuiLink href={link.url} target="_blank" rel="noreferrer" color="secondary">
                    {link.title}
                  </MuiLink>
                </Typography>
              ))}
            </Box>
          </Box>
        )}
        {booking && (
          <Box component="section" sx={{ mt: 6 }}>
            <Typography variant="h3" component="h2" align="left" sx={{ textAlign: 'left', fontSize: '1.15rem' }}>
              Booking
            </Typography>
            <Box sx={{ mt: 2 }}>
              {booking.manager && <Typography>Manager: {booking.manager}</Typography>}
              {booking.email && (
                <Typography>
                  Email:{' '}
                  <MuiLink href={`mailto:${booking.email}`} color="secondary">
                    {booking.email}
                  </MuiLink>
                </Typography>
              )}
              {booking.phone && (
                <Typography>
                  Phone:{' '}
                  <MuiLink href={`tel:${booking.phone}`} color="secondary">
                    {booking.phone}
                  </MuiLink>
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
