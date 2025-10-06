import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Paper,
  CircularProgress,
  
} from '@mui/material';
import Honeypot from '../components/Honeypot';

interface ContactFormData {
    name: string;   
    email: string;
    message: string;
    [key: string]: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(''); 
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {    
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const encode = (data: ContactFormData) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    }
    const resetForm = () => {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setLoading(true);
            setError('');

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({ "form-name": "NewRatsForm", ...formData })
            })
                .then(() =>resetForm())
                .catch(error => alert(error));
        } catch (e) {
            console.log(e);
        
        } finally {
            setLoading(false);
        }
        e.preventDefault();
        
    };

    return (
        <div>
             <Honeypot />
        {loading ? (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
               
        <Box onSubmit={handleSubmit} name="NewRatsForm" action="/" method="POST" data-netlify="true" sx={{ mt: 4, maxWidth: 600, mx: 'auto', p: 3 }} component="form" >
        <Stack spacing={2}>
          
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ py: 1.5 }}
          >
            Send Messages
          </Button>
        </Stack>
      </Box>)}
      {submitted && (
        <Alert severity="success" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
          Thank you for contacting us! We will get back to you soon.
        </Alert>
      )}
</div>
    );
}

export default Contact;
