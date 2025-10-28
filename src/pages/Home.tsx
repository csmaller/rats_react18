import { Box, Button, Container, Stack, Divider, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useRef, useState } from 'react';
// import About from './About';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
// import Tour from './Tour';
import ScrollToTop from '../shared/utils/scrollToTop';
import logo from '../assets/logo_transparent.png';

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
 
  const home = useRef(null);
  const about = useRef(null);
  const songs = useRef(null);
  const contact = useRef(null);
  const tour = useRef(null);

  const scrollIntoView = (elref: React.RefObject<HTMLElement>) => {
    const main = document.getElementById('main');

    if (main && elref.current) {
      const isMobile = window.innerWidth < 600;
      const offset = isMobile ? 80 : 120;
      
      main.scrollTo({
        behavior: 'smooth',
        top: elref.current.offsetTop - offset,
      }); 
    }
  };

  return (
    <Container
      id="main"
      sx={{
        overflowY: 'scroll',
        height: '100vh',
        width: '100%',
        maxWidth: '100% !important',
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        '& > *': { scrollSnapAlign: 'start' },
      }}
    >
       <Toolbar
        sx={{
          position: 'absolute',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'black',
          borderBottom: 3,
          borderColor: 'divider',
          width: '100%',
          py: { xs: 1, md: 2 },
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="img"
          sx={{
            height: { xs: 60, md: 80 },
            width: { xs: 75, md: 100 },
          }}
          alt="rats logo."
          src={logo}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => scrollIntoView(home)}>Home</Button>
            <Button onClick={() => scrollIntoView(contact)}>Contact</Button>
            <Button onClick={() => scrollIntoView(songs)}>Songs</Button>
            <ScrollToTop />
          </Stack>
        </Box>
        <IconButton
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            fontSize: '2rem',
            p: 2
          }}
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { scrollIntoView(home); setMobileOpen(false); }}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { scrollIntoView(contact); setMobileOpen(false); }}>
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { scrollIntoView(songs); setMobileOpen(false); }}>
                <ListItemText primary="Songs" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
        <Container 
          className="container home" 
          ref={home}
          sx={{ pt: { xs: 15, sm: 12, md: 10 } }}
        >
          <Video/>
          <Divider sx={{ height: 20, }} />
        </Container>
       <Container 
          className="container" 
          ref={contact}
          sx={{ px: { xs: 1, sm: 3 } }}
        >
          <Contact />
          <Divider sx={{ height: 20, }} />
        </Container>
        <Container 
          className="container" 
          ref={songs}
          sx={{ px: { xs: 1, sm: 3 } }}
        >
          <Songs />
          <Divider sx={{ height: 20, mt: 4 }} />
        </Container>
        
        {/* <Container className="container" ref={tour}>
          <Tour />
        </Container> */}
      
    </Container>
  );
};

export default Home;
