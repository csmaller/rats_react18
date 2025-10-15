import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { songsUrl } from '../shared/utils/url';

interface Song {
  id?: number;
  title: string;
  artist: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSong, setNewSong] = useState<Song>({ title: '', artist: '' });
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const fetchSongs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(songsUrl);
      if (!res.ok) throw new Error('Failed to fetch songs');
      const data = await res.json();
      setSongs(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching songs');
      setToast({ open: true, message: err.message || 'Error fetching songs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSongs();
  }, []);

  const handleAddSong = async () => {
    if (!newSong.title || !newSong.artist) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([newSong]),
      });
      if (!res.ok) throw new Error('Failed to add song');
      setNewSong({ title: '', artist: '' });
      setToast({ open: true, message: 'Song added', severity: 'success' });
      fetchSongs();
    } catch (err: any) {
      setError(err.message || 'Error adding song');
      setToast({ open: true, message: err.message || 'Error adding song', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSong = async (id: number, updated: Song) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update song');
      setToast({ open: true, message: 'Song updated', severity: 'success' });
      fetchSongs();
    } catch (err: any) {
      setError(err.message || 'Error updating song');
      setToast({ open: true, message: err.message || 'Error updating song', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (id: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete song');
      setToast({ open: true, message: 'Song deleted', severity: 'success' });
      fetchSongs();
    } catch (err: any) {
      setError(err.message || 'Error deleting song');
      setToast({ open: true, message: err.message || 'Error deleting song', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }} class="admin-login">
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>
      <Button variant="outlined" color="secondary" onClick={onLogout} sx={{ mb: 2 }}>
        Logout
      </Button>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Add New Song</Typography>
        <TextField
          label="Title"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Artist"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddSong} disabled={loading}>
          Add Song
        </Button>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          sx={{ width: '100%' }}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {loading && (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
        >
          <CircularProgress />
        </Box>
      )}
      {!loading && (
        <Grid container spacing={2}>
          {songs.map((song) => (
            <Grid item xs={12} sm={6} md={4} key={song.id}>
              <Card>
                <CardContent>
                  <TextField
                    label="Title"
                    value={song.title}
                    onChange={(e) => handleEditSong(song.id!, { ...song, title: e.target.value })}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Artist"
                    value={song.artist}
                    onChange={(e) => handleEditSong(song.id!, { ...song, artist: e.target.value })}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteSong(song.id!)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminPanel;
