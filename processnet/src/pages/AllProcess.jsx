import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Modal, Grid, MenuItem, Select, InputLabel, FormControl, TextField, TablePagination } from '@mui/material';
import { useAuth } from '../AuthContext';
import axios from '../axiosConfig';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatCnpj = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const formatProtocolo = (protocolo) => {
  return protocolo.replace(/(\d{3})(\d{4})/, '$1/$2');
};

const AllProcess = () => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [filters, setFilters] = useState({
    tipo: '',
    status: '',
    parecer: '',
    solicitante: '',
    funcionario: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        return { backgroundColor: '#f44336', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' };
      case 'ANALISE':
        return { backgroundColor: '#00bcd4', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONCLUIDO':
        return { backgroundColor: '#007bff', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      case 'EM_ANALISE':
        return { backgroundColor: '#f0ad4e', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      case 'AGUARDANDO':
        return { backgroundColor: '#6c757d', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      default:
        return {};
    }
  };

  const getParecerStyle = (parecer) => {
    switch (parecer) {
      case 'APROVADO':
        return { backgroundColor: '#28a745', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      case 'REPROVADO':
        return { backgroundColor: '#dc3545', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      case 'AGUARDANDO':
        return { backgroundColor: '#6c757d', color: '#fff', padding: '2px 8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', maxWidth: '100px', marginLeft: 0 };
      default:
        return {};
    }
  };

  const handleViewProcess = (processo) => {
    setSelectedProcess(processo);
    setIsViewModalOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            {filteredProcessos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>
                  <Box sx={getTipoStyle(processo.tipoProcesso)}>
                    {processo.tipoProcesso === 'VISTORIA' ? 'VT' : 'AN'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{formatProtocolo(processo.numeroProtocolo)}</Typography>
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
                      <IconButton color="primary" onClick={() => handleViewProcess(processo)}>
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProcessos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Detalhes do Processo
          </Typography>
          {selectedProcess && (
            <>
              <Typography><strong>Protocolo:</strong> {formatProtocolo(selectedProcess.numeroProtocolo)}</Typography>
              <Typography><strong>CNPJ:</strong> {formatCnpj(selectedProcess.cnpj)}</Typography>
              <Typography><strong>Endereço:</strong> {selectedProcess.endereco}</Typography>
              <Typography><strong>Status:</strong> <Box sx={getStatusStyle(selectedProcess.status)}>{selectedProcess.status}</Box></Typography>
              <Typography><strong>Parecer:</strong> <Box sx={getParecerStyle(selectedProcess.parecer)}>{selectedProcess.parecer}</Box></Typography>
              <Typography><strong>Funcionário:</strong> {selectedProcess.funcionario ? selectedProcess.funcionario.nome : '-'}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button onClick={() => setIsViewModalOpen(false)}>Fechar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllProcess;
