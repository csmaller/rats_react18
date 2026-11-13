import { Box, Button, Container, Typography } from '@mui/material';
import { songsPdfUrl } from '../shared/utils/url';

const facts = [
  ['Band', 'Rage Against the Supremes (RATS)'],
  ['Sound', 'Ski Town Party Music'],
  ['Based', 'Mountain West, since 2008'],
];

export default function PressKit() {
  return (
    <Box component="section" id="press" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2">
          Press kit
        </Typography>
        <Box sx={{ width: 72, height: 2, my: 2, backgroundColor: 'secondary.main' }} />
        <Box component="dl" sx={{ m: 0 }}>
          {facts.map(([label, value]) => (
            <Box key={label} sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 2, py: 1 }}>
              <Typography component="dt" color="secondary.main">
                {label}
              </Typography>
              <Typography component="dd" sx={{ m: 0 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          The set list is ready to download. Photos, a stage plot, and a longer bio sheet will be
          added here.
        </Typography>
        <Button component="a" href={songsPdfUrl} variant="outlined" color="secondary">
          Download Set List and Booking Information
        </Button>
      </Container>
    </Box>
  );
}
