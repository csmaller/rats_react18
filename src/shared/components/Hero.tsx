import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import logo from '../../assets/logo_transparent.png';
import { scrollToId } from '../utils/scrollTo';

const actions = [
  { id: 'shows', label: 'Shows' },
  { id: 'songs', label: 'Set list' },
  { id: 'press', label: 'Press kit' },
  { id: 'contact', label: 'Book' },
];

export default function Hero() {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(ellipse at top, rgba(255, 77, 109, 0.18), transparent 55%), radial-gradient(ellipse at bottom, rgba(126, 240, 255, 0.12), transparent 50%)',
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Box
          component="img"
          src={logo}
          alt="Rage Against the Supremes"
          sx={{ width: 'min(420px, 80vw)', height: 'auto', mb: 2 }}
        />
        <Box sx={{ width: 72, height: 2, mx: 'auto', mb: 2, backgroundColor: 'secondary.main' }} />
        <Typography variant="h4" component="p" sx={{ letterSpacing: '0.04em' }}>
          Ski Town Party Music
        </Typography>
        <Typography sx={{ mt: 2, color: 'text.secondary', maxWidth: 560, mx: 'auto', fontStyle: 'italic' }}>
          The most dangerous cover band in the world.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          {actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => scrollToId(action.id)}
              sx={{
                width: 108,
                height: 108,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'secondary.main',
                color: 'common.white',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {action.label}
            </Button>
          ))}
          <Button
            component="a"
            href="https://www.youtube.com/watch?v=LhsGpiRIk4A"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            sx={{
              width: 108,
              height: 108,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              minWidth: 0,
            }}
          >
            <YouTubeIcon sx={{ fontSize: 36 }} />
          </Button>
        </Stack>
        <Typography sx={{ mt: 6, letterSpacing: '0.28em', textTransform: 'uppercase', fontSize: 12 }}>
          Scroll
        </Typography>
      </Container>
    </Box>
  );
}
