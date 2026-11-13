import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { useState } from 'react';
import logo from '../../assets/logo_transparent.png';
import { scrollToId } from '../utils/scrollTo';

const links = [
  { id: 'home', label: 'Home' },
  { id: 'shows', label: 'Shows' },
  { id: 'media', label: 'Media' },
  { id: 'songs', label: 'Songs' },
  { id: 'press', label: 'EPK' },
  { id: 'contact', label: 'Contact' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: { xs: 2, md: 4 },
        py: 1,
        backgroundColor: 'rgba(7, 9, 13, 0.92)',
        borderBottom: '1px solid rgba(126, 240, 255, 0.25)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Button onClick={() => go('home')} sx={{ p: 0, minWidth: 0 }}>
        <Box
          component="img"
          src={logo}
          alt="RATS"
          sx={{ height: { xs: 52, md: 64 }, width: 'auto' }}
        />
      </Button>
      <Stack
        component="nav"
        direction="row"
        spacing={0.5}
        sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}
      >
        {links.map((link) => (
          <Button key={link.id} color="inherit" onClick={() => go(link.id)}>
            {link.label}
          </Button>
        ))}
      </Stack>
      <IconButton
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        sx={{ ml: 'auto', display: { md: 'none' }, color: 'secondary.main' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 240, pt: 2, backgroundColor: 'background.default', height: '100%' }}>
          {links.map((link) => (
            <ListItemButton key={link.id} onClick={() => go(link.id)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
