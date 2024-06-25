import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Modal, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useAuth } from '../AuthContext';
import axios from '../axiosConfig';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProcess = () => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [filters, setFilters] = useState({
    tipo: '',
    status: '',
    parecer: '',
    solicitante: '',
    funcionario: ''
  });

  useEffect(() => {
    fetchProcessos();
  }, []);

  const fetchProcessos = async () => {
    try {
      const response = await axios.get('/api/processos');
      setProcessos(response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const getTipoStyle = (tipo) => {
    switch (tipo) {
      case 'VISTORIA':
        return { backgroundColor: '#f44336', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold' };
      case 'ANALISE':
        return { backgroundColor: '#00bcd4', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONCLUIDO':
        return { backgroundColor: '#007bff', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
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
        return { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
      case 'REPROVADO':
        return { backgroundColor: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
      case 'AGUARDANDO':
        return { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '8px', textAlign: 'center' };
      default:
        return {};
    }
  };

  const handleDeleteProcess = (id, numeroProtocolo) => {
    setSelectedProcess({ id, numeroProtocolo });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/processos/${selectedProcess.id}`);
      toast.success('Processo excluído com sucesso!');
      fetchProcessos();
    } catch (error) {
      console.error('Erro ao excluir o processo:', error);
      toast.error('Erro ao excluir o processo. Tente novamente.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleViewProcess = (id) => {
    // Lógica para visualizar o processo
    console.log('Visualizar processo:', id);
  };

  const filteredProcessos = processos.filter((processo) => {
    return (
      (filters.tipo === '' || processo.tipoProcesso === filters.tipo) &&
      (filters.status === '' || processo.status === filters.status) &&
      (filters.parecer === '' || processo.parecer === filters.parecer) &&
      (filters.solicitante === '' || processo.responsavel?.nome.toLowerCase().includes(filters.solicitante.toLowerCase())) &&
      (filters.funcionario === '' || processo.funcionario?.nome.toLowerCase().includes(filters.funcionario.toLowerCase()))
    );
  }).sort((a, b) => b.id - a.id);

  const solicitantes = [...new Set(processos.map((processo) => processo.responsavel?.nome))];
  const funcionarios = [...new Set(processos.map((processo) => processo.funcionario?.nome))];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Todos os Processos
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              name="tipo"
              value={filters.tipo}
              onChange={handleFilterChange}
              label="Tipo"
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              <MenuItem value="VISTORIA">VT</MenuItem>
              <MenuItem value="ANALISE">AN</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              label="Status"
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              <MenuItem value="AGUARDANDO">Aguardando</MenuItem>
              <MenuItem value="EM_ANALISE">Em Análise</MenuItem>
              <MenuItem value="CONCLUIDO">Concluído</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Parecer</InputLabel>
            <Select
              name="parecer"
              value={filters.parecer}
              onChange={handleFilterChange}
              label="Parecer"
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              <MenuItem value="AGUARDANDO">Aguardando</MenuItem>
              <MenuItem value="APROVADO">Aprovado</MenuItem>
              <MenuItem value="REPROVADO">Reprovado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Solicitante"
            name="solicitante"
            value={filters.solicitante}
            onChange={handleFilterChange}
            list="solicitante-options"
            placeholder="Digite para buscar..."
            InputLabelProps={{ shrink: true }}
            sx={{ fontSize: '0.875rem' }}
          />
          <datalist id="solicitante-options">
            {solicitantes.map((solicitante) => (
              <option key={solicitante} value={solicitante} />
            ))}
          </datalist>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Funcionário"
            name="funcionario"
            value={filters.funcionario}
            onChange={handleFilterChange}
            list="funcionario-options"
            placeholder="Digite para buscar..."
            InputLabelProps={{ shrink: true }}
            sx={{ fontSize: '0.875rem' }}
          />
          <datalist id="funcionario-options">
            {funcionarios.map((funcionario) => (
              <option key={funcionario} value={funcionario} />
            ))}
          </datalist>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Processo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Solicitante</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Funcionário</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Parecer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProcessos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>
                  <Box sx={getTipoStyle(processo.tipoProcesso)}>
                    {processo.tipoProcesso === 'VISTORIA' ? 'VT' : 'AN'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{processo.numeroProtocolo}</Typography>
                    <Typography variant="body2">{processo.cnpj}</Typography>
                    <Typography variant="body2">{processo.endereco}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{processo.responsavel?.nome}</TableCell>
                <TableCell>{processo.funcionario?.nome || '-'}</TableCell>
                <TableCell>
                  <Box sx={getStatusStyle(processo.status)}>{processo.status}</Box>
                </TableCell>
                <TableCell>
                  <Box sx={getParecerStyle(processo.parecer)}>{processo.parecer}</Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center">
                    <Tooltip title="Visualizar">
                      <IconButton color="primary" onClick={() => handleViewProcess(processo.id)}>
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    {processo.status !== 'CONCLUIDO' && (
                      <Tooltip title="Excluir">
                        <IconButton color="secondary" onClick={() => handleDeleteProcess(processo.id, processo.numeroProtocolo)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar Exclusão
          </Typography>
          <Typography variant="body1" gutterBottom>
            Tem certeza que deseja excluir o processo de número de protocolo {selectedProcess?.numeroProtocolo}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="secondary">
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllProcess;
