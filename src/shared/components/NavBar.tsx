import { AppBar, Button, Stack, Toolbar, Box } from '@mui/material';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_transparent.png';

const NavBar: React.FC = () => {

  const home = useRef(null);
  const test = useRef(null);

  const scrollIntoView = (elref: React.RefObject<HTMLElement>) => {
    console.log(elref);
   
      window.scrollTo({ behavior: 'smooth' , top:elref.current?.offsetTop });//<--uncomment to enable scrolling to ref
 
  }

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
        src={logo}
      />
        <Stack direction="row" spacing={2}>
          <div color="inherit" onClick={scrollIntoView(home)}>
            Home
          </div>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/songs">
            Songs
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" onClick={scrollIntoView(test)}>
            test
          </Button>
          
        
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
