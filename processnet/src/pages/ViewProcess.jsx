import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const formatNumeroProtocolo = (numeroProtocolo) => {
  return numeroProtocolo.replace(/(\d{3})(\d{4})/, '$1/$2');
};

const formatCNPJ = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Concluido':
      return { backgroundColor: '#007bff', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Azul
    case 'Em Analise':
      return { backgroundColor: '#f0ad4e', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    case 'Aguardando':
      return { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    default:
      return {};
  }
};

const getParecerStyle = (parecer) => {
  switch (parecer) {
    case 'Aprovado':
      return { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Verde
    case 'Reprovado':
      return { backgroundColor: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Vermelho
    case 'Aguardando':
      return { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    default:
      return {};
  }
};

const ViewProcess = () => {
  const [vistoriaProcessos, setVistoriaProcessos] = useState([]);
  const [analiseProcessos, setAnaliseProcessos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await axios.get(`/api/processos/responsavel/${user.idPessoa}`);
        const processos = response.data;
        const vistoria = processos.filter(processo => processo.tipoProcesso === 'Vistoria');
        const analise = processos.filter(processo => processo.tipoProcesso === 'Analise');
        setVistoriaProcessos(vistoria);
        setAnaliseProcessos(analise);
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
      }
    };

    fetchProcessos();
  }, [user.idPessoa]);

  const commonTableHead = (
    <TableHead>
      <TableRow>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}>Protocolo</TableCell>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}>CNPJ</TableCell>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}>Endereço</TableCell>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}>Status</TableCell>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}>Parecer</TableCell>
        <TableCell sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>Opções</TableCell>
      </TableRow>
    </TableHead>
  );

  const renderProcessos = (processos) => (
    <TableBody>
      {processos.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).map((processo) => (
        <TableRow key={processo.id}>
          <TableCell>{formatNumeroProtocolo(processo.numeroProtocolo)}</TableCell>
          <TableCell>{formatCNPJ(processo.cnpj)}</TableCell>
          <TableCell>{processo.endereco}</TableCell>
          <TableCell>
            <Box sx={getStatusStyle(processo.status)}>{processo.status}</Box>
          </TableCell>
          <TableCell>
            <Box sx={getParecerStyle(processo.parecer)}>{processo.parecer}</Box>
          </TableCell>
          <TableCell>
            <Box display="flex" justifyContent="center">
              <Tooltip title="Editar">
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Visualizar">
                <IconButton color="primary">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Processos
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Vistoria Técnica
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {commonTableHead}
            {renderProcessos(vistoriaProcessos)}
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Análise de Projeto
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {commonTableHead}
            {renderProcessos(analiseProcessos)}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ViewProcess;
