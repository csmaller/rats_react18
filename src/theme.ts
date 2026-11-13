import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e53935' }, // red accent
    secondary: { main: '#ffb300' }, // gold accent
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Luckiest Guy", "Arial Black", sans-serif',
    h1: { textAlign: 'center' },
    h2: { textAlign: 'center' },
    h3: { textAlign: 'center' },
    h4: { textAlign: 'center' },
    h5: { textAlign: 'center' },
    h6: { textAlign: 'center' },
  },
});

export default theme;
