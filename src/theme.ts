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
    fontFamily: 'RocknRoll One, Roboto, Arial, sans-serif',
  },
});

export default theme;
