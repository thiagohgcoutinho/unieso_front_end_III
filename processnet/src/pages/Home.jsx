// src/pages/Home.jsx
import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao ProcessNet
        </Typography>
        <Typography variant="body1" gutterBottom>
          Faça login para acessar sua conta.
        </Typography>
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Box>
    </Container>
  );
}

export default Home;
