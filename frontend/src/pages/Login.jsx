import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import ErrorModal from '../components/ErrorModal';

// 2.1.1. Login Screen
export default function SignIn ({ token, setTokenFunction }) {
  if (token !== null) {
    return <Navigate to='/dashboard' />;
  }

  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email: formData.email,
        password: formData.password,
      })
      setTokenFunction(response.data.token);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const navigate = useNavigate();
  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <Container maxWidth="xs" data-testid="abc">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ m: 3, fontWeight: 'bold', color: 'secondary.main' }}>
          Presto
        </Typography>
        <Typography variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <ErrorModal e={error} setE={setError}/>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Link href="#" variant="body2" onClick={handleSignUpClick}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
