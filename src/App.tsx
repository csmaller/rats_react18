
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { Divider,Container, Box} from '@mui/material';
import ScrollToTop from './shared/utils/scrollToTop';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
 
  return (
      <Container sx={{ maxWidth: '100% !important' }} disableGutters >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              adminLoggedIn ? (
                <AdminPanel onLogout={() => setAdminLoggedIn(false)} />
              ) : (
                <AdminLogin onLogin={() => setAdminLoggedIn(true)} />
              )
            }
          />
        </Routes>
        <Box sx={{ mt: 4, mb: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Divider />
          <div><small>&copy; {new Date().getFullYear()} Rats. All rights reserved.</small></div>
           <ScrollToTop />
        </Box> 
       
      </Container>
  );
};

export default App;
