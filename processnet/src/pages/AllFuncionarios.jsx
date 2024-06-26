import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Tooltip
} from '@mui/material';
import { Visibility, Delete, List } from '@mui/icons-material';
import axios from '../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const formatCpf = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

const formatCnpj = (cnpj) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Endereço do backend
  withCredentials: true, // Inclua as credenciais nas requisições
});

function AllFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openProcessos, setOpenProcessos] = useState(false);
  const [processos, setProcessos] = useState([]);
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [openProcessoDetail, setOpenProcessoDetail] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const response = await instance.get('/api/funcionarios');
      setFuncionarios(response.data);
      console.log("Funcionários carregados:", response.data);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast.error('Erro ao buscar funcionários.');
    }
  };

  const handleDeleteConfirmation = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setOpenDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/funcionarios/${selectedFuncionario.idPessoa}`);
      toast.success('Funcionário excluído com sucesso!');
      fetchFuncionarios();
      setOpenDeleteConfirmation(false);
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast.error('Erro ao excluir funcionário. Tente novamente mais tarde.');
    }
  };

  const handleViewFuncionario = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setOpenView(true);
  };

  const handleViewProcessos = async (funcionario) => {
    try {
      const response = await instance.get(`/api/processos/funcionario/${funcionario.idPessoa}`);
      setProcessos(response.data);
      setSelectedFuncionario(funcionario);
      setOpenProcessos(true);
      console.log("Processos carregados para o funcionário:", response.data);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      toast.error('Erro ao buscar processos.');
    }
  };

  const handleViewProcessoDetail = (processo) => {
    setSelectedProcesso(processo);
    setOpenProcessoDetail(true);
  };

  const formatProtocolo = (protocolo) => {
    return protocolo.replace(/(\d{3})(\d{4})/, '$1/$2');
  };

  const renderStatusIndicator = (status) => {
    const statusClassMap = {
      CONCLUIDO: 'status-concluido',
      EM_ANALISE: 'status-em-analise',
      AGUARDANDO: 'status-aguardando',
    };
  
    return (
      <span className={`status-indicator ${statusClassMap[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  const renderParecerIndicator = (parecer) => {
    const parecerClassMap = {
      APROVADO: 'parecer-aprovado',
      REPROVADO: 'parecer-reprovado',
      AGUARDANDO: 'parecer-aguardando',
    };
  
    return (
      <span className={`parecer-indicator ${parecerClassMap[parecer]}`}>
        {parecer.charAt(0).toUpperCase() + parecer.slice(1).toLowerCase()}
      </span>
    );
  };

  const renderTipoIndicator = (tipo) => {
    const tipoClassMap = {
      VISTORIA: 'tipo-vistoria',
      ANALISE: 'tipo-analise',
    };
  
    return (
      <span className={`tipo-indicator ${tipoClassMap[tipo]}`}>
        {tipo === 'VISTORIA' ? 'VT' : 'AN'}
      </span>
    );
  };

  return (
    <Container maxWidth="lg">
      <ToastContainer />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Todos os Funcionários
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="table-head-cell"><strong>Nome</strong></TableCell>
                <TableCell className="table-head-cell"><strong>Email</strong></TableCell>
                <TableCell className="table-head-cell"><strong>Telefone</strong></TableCell>
                <TableCell className="table-head-cell"><strong>Cargo</strong></TableCell>
                <TableCell className="table-head-cell"><strong>Opções</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionarios.map((funcionario) => (
                <TableRow key={funcionario.idPessoa}>
                  <TableCell>{funcionario.nome}</TableCell>
                  <TableCell>{funcionario.email}</TableCell>
                  <TableCell>{formatPhoneNumber(funcionario.telefone)}</TableCell>
                  <TableCell>{funcionario.cargo.charAt(0).toUpperCase() + funcionario.cargo.slice(1).toLowerCase()}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center">
                      <Tooltip title="Visualizar">
                        <IconButton onClick={() => handleViewFuncionario(funcionario)}>
                          <Visibility className="icon-blue" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Processos">
                        <IconButton onClick={() => handleViewProcessos(funcionario)}>
                          <List className="icon-cyan" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => handleDeleteConfirmation(funcionario)} disabled={funcionario.hasProcessos}>
                          <Delete className="icon-red" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Detalhes do Funcionário</DialogTitle>
        <DialogContent className="card-shadow">
          {selectedFuncionario && (
            <>
              <Typography><strong>Nome:</strong> {selectedFuncionario.nome}</Typography>
              <Typography><strong>CPF:</strong> {formatCpf(selectedFuncionario.cpf)}</Typography>
              <Typography><strong>Email:</strong> {selectedFuncionario.email}</Typography>
              <Typography><strong>Telefone:</strong> {formatPhoneNumber(selectedFuncionario.telefone)}</Typography>
              <Typography><strong>Cargo:</strong> {selectedFuncionario.cargo.charAt(0).toUpperCase() + selectedFuncionario.cargo.slice(1).toLowerCase()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProcessos} onClose={() => setOpenProcessos(false)} maxWidth="md" fullWidth>
        <DialogTitle>Processos de {selectedFuncionario?.nome}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#e0e0e0' }}><strong>Tipo</strong></TableCell>
                  <TableCell sx={{ backgroundColor: '#e0e0e0' }}><strong>Protocolo</strong></TableCell>
                  <TableCell sx={{ backgroundColor: '#e0e0e0' }}><strong>CNPJ</strong></TableCell>
                  <TableCell sx={{ backgroundColor: '#e0e0e0' }}><strong>Endereço</strong></TableCell>
                  <TableCell sx={{ backgroundColor: '#e0e0e0' }}><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processos.map((processo) => (
                  <TableRow key={processo.idProcesso} onClick={() => handleViewProcessoDetail(processo)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}>
                    <TableCell>
                      <Box>
                        {renderTipoIndicator(processo.tipoProcesso)}
                      </Box>
                    </TableCell>
                    <TableCell>{formatProtocolo(processo.numeroProtocolo)}</TableCell>
                    <TableCell>{formatCnpj(processo.cnpj)}</TableCell>
                    <TableCell>{processo.endereco}</TableCell>
                    <TableCell>{renderStatusIndicator(processo.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProcessos(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProcessoDetail} onClose={() => setOpenProcessoDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Processo</DialogTitle>
        <DialogContent className="card-shadow">
          {selectedProcesso && (
            <>
              <Typography className="card-content"><strong>Protocolo:</strong> {formatProtocolo(selectedProcesso.numeroProtocolo)}</Typography>
              <Typography className="card-content"><strong>CNPJ:</strong> {selectedProcesso.cnpj}</Typography>
              <Typography className="card-content"><strong>Endereço:</strong> {selectedProcesso.endereco}</Typography>
              <Typography className="card-content"><strong>Usuário:</strong> {selectedProcesso.responsavel ? selectedProcesso.responsavel.nome : '-'}</Typography>
              <div className="card-row">
                <div className="card-column">
                  <Typography><strong>Status:</strong> {renderStatusIndicator(selectedProcesso.status)}</Typography>
                </div>
                <div className="card-column">
                  <Typography><strong>Parecer:</strong> {renderParecerIndicator(selectedProcesso.parecer)}</Typography>
                </div>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProcessoDetail(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirmation} onClose={() => setOpenDeleteConfirmation(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir o funcionário {selectedFuncionario?.nome}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AllFuncionarios;
