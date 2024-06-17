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

// 2.1.2. Register Screen
export default function SignUp ({ token, setTokenFunction }) {
  if (token !== null) {
    return <Navigate to='/dashboard' />;
  }
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({ email: '', name: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email;
    const name = formData.name;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Validation: none of the fields should be empty
    if (!email || !name || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    // Validation: Password and Confirm Password must match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email: formData.email,
        password: formData.password,
      })
      setTokenFunction(response.data.token);
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  // link to sign in page
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate('/login');
  };
  // press enter to submit form
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ m: 3, fontWeight: 'bold', color: 'secondary.main' }}>
          Presto
        </Typography>
        <Typography variant="h5">
          Sign up
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
            label="Name"
            name="name"
            value={formData.name}
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
            onKeyDown={handleKeyDown}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Link onClick={handleSignInClick} href="#" variant="body2">
              {'Already have an account? Sign In'}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
