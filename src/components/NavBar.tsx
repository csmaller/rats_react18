import { AppBar, Button, Stack, Toolbar, Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {

  return (
    <AppBar position="sticky" sx={{ mb: 4, py:2, borderBottom: 1, borderColor: 'divider' , backgroundColor:"black "}}>
      <Toolbar>
        <Box
        component="img"
        sx={{
          mr:3,
          height: 100,
          width: 140,
          maxHeight: { xs: 100, md: 100 },
          maxWidth: { xs: 140, md: 140 },
        }}
        alt="rats logo."
        src="/src/assets/logo_transparent.png"
      />
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
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          
        
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
