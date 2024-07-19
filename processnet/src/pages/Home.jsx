import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container className="home-container">
      <Box className="home-content" sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao ProcessNet
        </Typography>
        <Typography variant="body1" gutterBottom>
          O ProcessNet é um sistema avançado de gerenciamento de processos, projetado para facilitar e otimizar a gestão de processos dentro da sua organização. Faça login para acessar sua conta e começar a gerenciar seus processos de maneira eficiente e eficaz.
        </Typography>
        <Link component={RouterLink} to="/login" variant="button">
          Login
        </Link>
      </Box>
    </Container>
  );
}

export default Home;
