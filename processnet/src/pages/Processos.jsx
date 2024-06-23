// src/pages/Processos.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

function Processos() {
  const [processos, setProcessos] = useState([]);

  useEffect(() => {
    axios.get('/api/processos')
      .then(response => setProcessos(response.data))
      .catch(error => console.error('Erro ao buscar processos:', error));
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Processos
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/processos/new" sx={{ mb: 2 }}>
          Adicionar Processo
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número de Protocolo</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Tipo de Processo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processos.map(processo => (
              <TableRow key={processo.id}>
                <TableCell>{processo.id}</TableCell>
                <TableCell>{processo.numeroProtocolo}</TableCell>
                <TableCell>{processo.dataCriacao}</TableCell>
                <TableCell>{processo.tipoProcesso}</TableCell>
                <TableCell>{processo.status}</TableCell>
                <TableCell>
                  <Button color="primary" component={Link} to={`/processos/${processo.id}`}>
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}

export default Processos;
