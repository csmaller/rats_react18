import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { loginAsync, logoutAsync } from '../store/slices/authSlice';


const NavBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    dispatch(loginAsync('demoUser'));
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  return (
    <AppBar position="sticky" sx={{ mb: 4, backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rats
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/songs">
            Songs
          </Button>
          <Button color="inherit" component={Link} to="/tour">
            Tour
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout} disabled={loading}>
              Logout ({user})
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogin} disabled={loading}>
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
