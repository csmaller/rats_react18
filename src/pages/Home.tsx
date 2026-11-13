import { Box, Button, Container, Stack, Divider, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Video from '../shared/components/Video';
import Songs from './Songs';
import Contact from './Contact';
import Epk from './Epk';
import ScrollToTop from '../shared/utils/scrollToTop';
import logo from '../assets/logo_transparent.png';
import logoRat from '../assets/logo_rat.png';

const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const home = useRef<HTMLDivElement>(null);
  const contact = useRef<HTMLDivElement>(null);
  const songs = useRef<HTMLDivElement>(null);
  const epk = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: React.RefObject<HTMLDivElement | null>) => {
    const main = document.getElementById('main');
    const target = section.current;

    if (!main || !target) {
      return;
    }

    const top =
      target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 88;

    main.scrollTo({
      behavior: 'smooth',
      top: Math.max(0, top),
    });
  };

  const go = (section: React.RefObject<HTMLDivElement | null>) => {
    setMobileOpen(false);
    scrollToSection(section);
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
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={() => go(home)}
          aria-label="Back to main page"
          sx={{ position: 'absolute', left: { xs: 8, md: 16 }, p: 0.5 }}
        >
          <Box
            component="img"
            src={logoRat}
            alt=""
            sx={{ height: { xs: 42, md: 52 }, width: 'auto', display: 'block' }}
          />
        </IconButton>
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => go(home)}>Home</Button>
            <Button component={Link} to="/videos">Videos</Button>
            <Button onClick={() => go(contact)}>Contact</Button>
            <Button onClick={() => go(songs)}>Songs</Button>
            <Button onClick={() => go(epk)}>EPK</Button>
            <ScrollToTop />
          </Stack>
        </Box>
        <IconButton
          sx={{ 
            display: { xs: 'flex', sm: 'none' },
            fontSize: '2rem',
            p: 2,
            position: 'absolute',
            right: 8,
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
              <ListItemButton onClick={() => go(home)}>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/videos" onClick={() => setMobileOpen(false)}>
                <ListItemText primary="Videos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go(contact)}>
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go(songs)}>
                <ListItemText primary="Songs" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go(epk)}>
                <ListItemText primary="EPK" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
        <Container
          className="container home"
          ref={home}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: { xs: 10, md: 12 },
            pb: 6,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Rage Against the Supremes"
            sx={{ width: { xs: 'min(86vw, 340px)', md: 'min(52vw, 520px)' }, height: 'auto' }}
          />
          <Typography variant="h3" component="h1" sx={{ mt: 3, letterSpacing: '0.04em' }}>
            Ski Town Party Music
          </Typography>
          <Typography sx={{ mt: 1.5, maxWidth: 560, color: 'text.secondary', fontStyle: 'italic' }}>
            The most dangerous cover band in the world.
          </Typography>
        </Container>
        <Container className="container" sx={{ px: { xs: 1, sm: 4 } }}>
          <Video />
          <Divider sx={{ height: 20 }} />
        </Container>
       <Container 
          className="container" 
          ref={contact}
          sx={{ px: { xs: 1, sm: 4} }}
        >
          <Contact />
          <Divider sx={{ height: 20 }} />
        </Container>
        
        <Container
          className="container" 
          ref={songs}
          sx={{ px: { xs: 1, sm: 4 } }}
        >
          <Songs />
          <Divider sx={{ height: 20}} />
        </Container>
        <Container className="container" ref={epk} sx={{ px: { xs: 1, sm: 4 } }}>
          <Epk embedded />
        </Container>
      
    </Container>
  );
};

export default Home;
