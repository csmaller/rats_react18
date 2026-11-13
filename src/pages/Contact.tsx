import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  Link,
} from '@mui/material';
import Honeypot from '../shared/components/Honeypot';
import { contactInfoUrl, songsPdfUrl } from '../shared/utils/url';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  [key: string]: string;
}

type ContactInfo = {
  note: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
};

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [info, setInfo] = React.useState<ContactInfo>({
    note: '',
    name: null,
    phone: null,
    email: null,
    location: null,
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    fetch(contactInfoUrl)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: ContactInfo) => {
        if (active) {
          setInfo({
            note: data.note ?? '',
            name: data.name,
            phone: data.phone,
            email: data.email,
            location: data.location,
          });
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const encode = (data: ContactFormData) => {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  };
  const resetForm = () => {
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'rats-form-2025', ...formData }),
      })
        .then(() => resetForm())
        .catch((submitError) => alert(submitError));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, margin: '0 auto', px: 2, py: { xs: 2, md: 4 } }}>
      <Typography variant="h3" component="h2" sx={{ mb: 3 }}>
        Contact
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'start',
        }}
      >
        <Box>
          <Typography sx={{ mb: 2 }}>
            <Link href={songsPdfUrl} color="secondary">
              Download Set List and Booking Information
            </Link>
          </Typography>
          {info.note && <Typography sx={{ mb: 3 }}>{info.note}</Typography>}
          {info.name && <Typography>{info.name}</Typography>}
          {info.phone && (
            <Typography>
              <Link href={`tel:${info.phone}`} color="secondary">
                {info.phone}
              </Link>
            </Typography>
          )}
          {info.email && (
            <Typography>
              <Link href={`mailto:${info.email}`} color="secondary">
                {info.email}
              </Link>
            </Typography>
          )}
          {info.location && <Typography sx={{ mt: 2 }}>{info.location}</Typography>}
        </Box>
        <Box>
          <Honeypot />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <form onSubmit={handleSubmit} name="rats-form-2025" action="/" method="POST" data-netlify="true">
              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                <input type="hidden" name="form-name" value="rats-form-2025" />
                <TextField
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={formData.message}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ py: 1.5 }}>
                  Send message
                </Button>
              </Stack>
            </form>
          )}
          {submitted && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Thank you for contacting us! We will get back to you soon.
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
