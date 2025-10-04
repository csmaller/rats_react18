import { Container } from '@mui/material';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import About from './pages/About';
import Home from './pages/Home';
import Songs from './pages/Songs';
import Tour from './pages/Tour';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/tour" element={<Tour />} />
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
      </Container>
    </>
  );
};

export default App;
