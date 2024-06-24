import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from '../axiosConfig';

function ProcessDetail() {
  const { id } = useParams();
  const [processo, setProcesso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/processos/${id}`)
      .then(response => {
        setProcesso(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do processo:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!processo) {
    return (
      <Container>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Processo não encontrado
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Detalhes do Processo
        </Typography>
        <Typography variant="h6" gutterBottom>
          Número do Protocolo: {processo.numeroProtocolo}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Data de Criação: {processo.dataCriacao}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tipo de Processo: {processo.tipoProcesso}
        </Typography>
        <Typography variant="body1" gutterBottom>
          CNPJ: {processo.cnpj}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Endereço: {processo.endereco}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Responsável: {processo.responsavel.nome}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Status: {processo.status}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Parecer: {processo.parecer}
        </Typography>
      </Box>
    </Container>
  );
}

export default ProcessDetail;
