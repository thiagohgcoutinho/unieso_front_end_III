// src/pages/FuncionarioDashboard.jsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function FuncionarioDashboard() {
  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Painel do Funcionário
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/processos/new">
          Consultar Novos Processos
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/processos">
          Consultar Processos Selecionados
        </Button>
      </Box>
    </Container>
  );
}

export default FuncionarioDashboard;
