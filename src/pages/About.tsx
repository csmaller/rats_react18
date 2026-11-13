import { Box, Button, Container, Stack, Typography } from '@mui/material';
import logo from '../assets/logo_transparent.png';
import { scrollToId } from '../shared/utils/scrollTo';

const jumps = [
  { id: 'shows', label: 'See Shows' },
  { id: 'songs', label: 'Set List' },
  { id: 'contact', label: 'Book the Band' },
];

export default function About() {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 360px) 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box component="img" src={logo} alt="RATS" sx={{ width: '100%', maxWidth: 360, mx: 'auto' }} />
          <Box>
            <Typography variant="h3" component="h2">
              Ski Town Party Music
            </Typography>
            <Box sx={{ width: 72, height: 2, my: 2, backgroundColor: 'secondary.main' }} />
            <Typography sx={{ mb: 2 }}>
              Since 2008, RATS has been rocking stages across Utah, California, Colorado, Wyoming,
              Nevada, and Idaho. Blending influences from almost every popular genre, we’ve created a
              sound we proudly call ‘Ski Town Party Music.’
            </Typography>
            <Typography sx={{ mb: 3 }}>
              With an extensive catalog, crowd-favorite medleys, infectious energy, and a fun, upbeat
              stage presence, RATS has become known as one of the premier party bands in the Mountain
              West.
            </Typography>
            <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
              {jumps.map((jump) => (
                <Button key={jump.id} variant="outlined" color="secondary" onClick={() => scrollToId(jump.id)}>
                  {jump.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
