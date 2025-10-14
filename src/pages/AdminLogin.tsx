import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login} from '../store/slices/authSlice';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginType = await dispatch(login({ username, password }));
  
    if(loginType.type === 'auth/login/fulfilled') {
      console.log('Login successful');
      onLogin();
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 12 }} class="admin-login">
      <Typography variant="h5" gutterBottom>
        Admin Login
      </Typography>
      <Box sx={{justifyContent:"start", paddingRight:2}}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      </Box>
    </Box>
  );
};

export default AdminLogin;
