import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Modal, TextField, Button } from '@mui/material';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import SearchIcon from '@mui/icons-material/Search';

const formatNumeroProtocolo = (numeroProtocolo) => {
  return numeroProtocolo.replace(/(\d{3})(\d{4})/, '$1/$2');
};

const formatCNPJ = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'CONCLUIDO':
      return { backgroundColor: '#007bff', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Azul
    case 'EM_ANALISE':
      return { backgroundColor: '#f0ad4e', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    case 'AGUARDANDO':
      return { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    default:
      return {};
  }
};

const getParecerStyle = (parecer) => {
  switch (parecer) {
    case 'APROVADO':
      return { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Verde
    case 'REPROVADO':
      return { backgroundColor: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' }; // Vermelho
    case 'AGUARDANDO':
      return { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
    default:
      return {};
  }
};

const ViewProcess = () => {
  const [vistoriaProcessos, setVistoriaProcessos] = useState([]);
  const [analiseProcessos, setAnaliseProcessos] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await axios.get(`/api/processos/responsavel/${user.idPessoa}`);
        const processos = response.data;
        const vistoria = processos.filter(processo => processo.tipoProcesso === 'VISTORIA');
        const analise = processos.filter(processo => processo.tipoProcesso === 'ANALISE');
        setVistoriaProcessos(vistoria);
        setAnaliseProcessos(analise);
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
      }
    };

    fetchProcessos();
  }, [user.idPessoa]);

  const handleViewClick = (processo) => {
    setSelectedProcess(processo);
    setIsViewMode(true);
  };

  const handleEditClick = () => {
    setIsViewMode(false);
    setIsEditMode(true);
  };

  const handleClose = () => {
    setSelectedProcess(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/processos/${selectedProcess.id}`, selectedProcess);
      handleClose();
      // Re-fetch the processes to update the table
      const response = await axios.get(`/api/processos/responsavel/${user.idPessoa}`);
      const processos = response.data;
      const vistoria = processos.filter(processo => processo.tipoProcesso === 'VISTORIA');
      const analise = processos.filter(processo => processo.tipoProcesso === 'ANALISE');
      setVistoriaProcessos(vistoria);
      setAnaliseProcessos(analise);
    } catch (error) {
      console.error('Erro ao salvar o processo:', error);
    }
  };

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
      {processos.sort((a, b) => {
        const numeroProtocoloA = parseInt(a.numeroProtocolo.replace('/', ''), 10);
        const numeroProtocoloB = parseInt(b.numeroProtocolo.replace('/', ''), 10);
        return numeroProtocoloB - numeroProtocoloA;
      }).map((processo) => (
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
              <Tooltip title="Visualizar">
                <IconButton color="primary" onClick={() => handleViewClick(processo)}>
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

      <Modal open={isEditMode || isViewMode} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {isEditMode ? 'Editar Processo' : 'Visualizar Processo'}
          </Typography>
          {selectedProcess && (
            <Box>
              <Typography variant="body1"><strong>Protocolo:</strong> {formatNumeroProtocolo(selectedProcess.numeroProtocolo)}</Typography>
              <Typography variant="body1"><strong>CNPJ:</strong> {isEditMode ? (
                <TextField
                  value={formatCNPJ(selectedProcess.cnpj)}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setSelectedProcess({ ...selectedProcess, cnpj: e.target.value.replace(/\D/g, '') })}
                />
              ) : (
                formatCNPJ(selectedProcess.cnpj)
              )}</Typography>
              <Typography variant="body1"><strong>Endereço:</strong> {isEditMode ? (
                <TextField
                  value={selectedProcess.endereco}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setSelectedProcess({ ...selectedProcess, endereco: e.target.value })}
                />
              ) : (
                selectedProcess.endereco
              )}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Status:
                  </Typography>
                  <Box sx={getStatusStyle(selectedProcess.status)}>{selectedProcess.status}</Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-start' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Parecer:
                  </Typography>
                  <Box sx={getParecerStyle(selectedProcess.parecer)}>{selectedProcess.parecer}</Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="subtitle2">Data de Criação: {selectedProcess.dataCriacao}</Typography>
                <Typography variant="subtitle2">
                  {selectedProcess.tipoProcesso === 'VISTORIA' ? 'Vistoriador' : 'Analista'}: {selectedProcess.vistoriador || 'Não Selecionado'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {isViewMode && (
                  <Button onClick={handleEditClick} variant="contained" color="primary" sx={{ mr: 2 }}>
                    Editar
                  </Button>
                )}
                <Button onClick={handleClose} sx={{ mr: 2 }}>
                  {isEditMode ? 'Cancelar' : 'Fechar'}
                </Button>
                {isEditMode && (
                  <Button onClick={handleSave} variant="contained" color="primary">
                    Salvar
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewProcess;
