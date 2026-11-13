import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoRat from '../../assets/logo_rat.png';
import ScrollToTop from '../utils/scrollToTop';

export type HomeSection = 'home' | 'contact' | 'songs' | 'epk';

type Props = {
  onSection?: (section: HomeSection) => void;
  overlay?: boolean;
};

const sections: { id: HomeSection | 'media'; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Contact' },
  { id: 'songs', label: 'Songs' },
  { id: 'epk', label: 'EPK' },
];

export default function BandNav({ onSection, overlay = false }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (section: HomeSection) => {
    setMobileOpen(false);
    onSection?.(section);
  };

  return (
    <>
      <Toolbar
        component="nav"
        sx={{
          position: overlay ? 'absolute' : 'sticky',
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
        {onSection ? (
          <IconButton
            onClick={() => go('home')}
            aria-label="Back to main page"
            sx={{ position: 'absolute', left: { xs: 8, md: 16 }, p: 0.5 }}
          >
            <Box component="img" src={logoRat} alt="" sx={{ height: { xs: 42, md: 52 }, width: 'auto', display: 'block' }} />
          </IconButton>
        ) : (
          <IconButton
            component={Link}
            to="/"
            aria-label="Back to main page"
            sx={{ position: 'absolute', left: { xs: 8, md: 16 }, p: 0.5 }}
          >
            <Box component="img" src={logoRat} alt="" sx={{ height: { xs: 42, md: 52 }, width: 'auto', display: 'block' }} />
          </IconButton>
        )}
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Stack direction="row" spacing={2}>
            {sections.map((section) => {
              if (section.id === 'media') {
                return (
                  <Button key={section.id} component={Link} to="/media">
                    {section.label}
                  </Button>
                );
              }

              const id = section.id;

              return onSection ? (
                <Button key={id} onClick={() => go(id)}>
                  {section.label}
                </Button>
              ) : (
                <Button key={id} component={Link} to={`/#${id}`}>
                  {section.label}
                </Button>
              );
            })}
            <ScrollToTop />
          </Stack>
        </Box>
        <IconButton
          aria-label="Open menu"
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
            {sections.map((section) => {
              if (section.id === 'media') {
                return (
                  <ListItem key={section.id} disablePadding>
                    <ListItemButton component={Link} to="/media" onClick={() => setMobileOpen(false)}>
                      <ListItemText primary={section.label} />
                    </ListItemButton>
                  </ListItem>
                );
              }

              const id = section.id;

              return (
                <ListItem key={id} disablePadding>
                  {onSection ? (
                    <ListItemButton onClick={() => go(id)}>
                      <ListItemText primary={section.label} />
                    </ListItemButton>
                  ) : (
                    <ListItemButton component={Link} to={`/#${id}`} onClick={() => setMobileOpen(false)}>
                      <ListItemText primary={section.label} />
                    </ListItemButton>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
