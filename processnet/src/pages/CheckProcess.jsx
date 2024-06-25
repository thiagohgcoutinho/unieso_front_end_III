import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Modal, Button } from '@mui/material';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const CheckProcess = () => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await axios.get(`/api/processos/funcionario/${user.idPessoa}`);
        setProcessos(response.data);
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
        toast.error('Erro ao buscar processos. Tente novamente.');
      }
    };

    fetchProcessos();
  }, [user.idPessoa]);

  const handleViewClick = (processo) => {
    setSelectedProcess(processo);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedProcess(null);
    setIsModalOpen(false);
  };

  const handleParecer = async (parecer) => {
    try {
      const payload = { parecer };
      await axios.put(`/api/processos/${selectedProcess.id}/parecer`, payload);
      toast.success(`Processo ${parecer.toLowerCase()} com sucesso!`);
      setProcessos((prev) => 
        prev.map((proc) => (proc.id === selectedProcess.id ? { ...proc, parecer, status: 'CONCLUIDO' } : proc))
      );
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar parecer:', error);
      toast.error('Erro ao atualizar parecer. Tente novamente.');
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
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Verificar Processos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          {commonTableHead}
          {renderProcessos(processos)}
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Emitir Parecer
          </Typography>
          {selectedProcess && (
            <Box>
              <Typography variant="body1"><strong>Protocolo:</strong> {formatNumeroProtocolo(selectedProcess.numeroProtocolo)}</Typography>
              <Typography variant="body1"><strong>CNPJ:</strong> {formatCNPJ(selectedProcess.cnpj)}</Typography>
              <Typography variant="body1"><strong>Endereço:</strong> {selectedProcess.endereco}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedProcess.status}</Typography>
              <Typography variant="body1"><strong>Parecer:</strong> {selectedProcess.parecer}</Typography>
              <Typography variant="body1"><strong>Data de Criação:</strong> {selectedProcess.dataCriacao}</Typography>
              {selectedProcess.parecer === 'AGUARDANDO' ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={() => handleParecer('APROVADO')} variant="contained" color="primary">
                    Aprovar
                  </Button>
                  <Button onClick={() => handleParecer('REPROVADO')} variant="contained" color="secondary">
                    Reprovar
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button onClick={handleClose}>
                    Fechar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CheckProcess;
