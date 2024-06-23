// src/pages/GestorDashboard.jsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function GestorDashboard() {
  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Painel do Gestor
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/processos">
          Consultar Todos os Processos
        </Button>
      </Box>
    </Container>
  );
}

export default GestorDashboard;
