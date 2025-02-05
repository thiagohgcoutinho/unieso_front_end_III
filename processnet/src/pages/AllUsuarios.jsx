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

function AllUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openProcessos, setOpenProcessos] = useState(false);
  const [processos, setProcessos] = useState([]);
  const [selectedProcesso, setSelectedProcesso] = useState(null);
  const [openProcessoDetail, setOpenProcessoDetail] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await instance.get('/api/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleDeleteConfirmation = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/api/usuarios/${selectedUsuario.idPessoa}`);
      toast.success('Usuário excluído com sucesso!');
      fetchUsuarios();
      setOpenDeleteConfirmation(false);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário. Tente novamente mais tarde.');
    }
  };

  const handleViewUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setOpenView(true);
  };

  const handleViewProcessos = async (usuario) => {
    try {
      const response = await instance.get(`/api/processos/responsavel/${usuario.idPessoa}`);
      setProcessos(response.data);
      setSelectedUsuario(usuario);
      setOpenProcessos(true);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
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
      <ToastContainer className="toast-container" />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Todos os Usuários
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="table-head-cell">Nome</TableCell>
                <TableCell className="table-head-cell">Email</TableCell>
                <TableCell className="table-head-cell">Telefone</TableCell>
                <TableCell className="table-head-cell">Opções</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.idPessoa}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{formatPhoneNumber(usuario.telefone)}</TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="center">
                      <Tooltip title="Visualizar">
                        <IconButton onClick={() => handleViewUsuario(usuario)}>
                          <Visibility className="icon-blue" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Processos">
                        <IconButton onClick={() => handleViewProcessos(usuario)}>
                          <List className="icon-cyan" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton onClick={() => handleDeleteConfirmation(usuario)} disabled={usuario.hasProcessos}>
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
        <DialogTitle>Detalhes do Usuário</DialogTitle>
        <DialogContent className="card-shadow">
          {selectedUsuario && (
            <>
              <Typography><strong>Nome:</strong> {selectedUsuario.nome}</Typography>
              <Typography><strong>CPF:</strong> {formatCpf(selectedUsuario.cpf)}</Typography>
              <Typography><strong>Email:</strong> {selectedUsuario.email}</Typography>
              <Typography><strong>Telefone:</strong> {formatPhoneNumber(selectedUsuario.telefone)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProcessos} onClose={() => setOpenProcessos(false)} maxWidth="md" fullWidth>
        <DialogTitle>Processos de {selectedUsuario?.nome}</DialogTitle>
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
              <Typography className="card-content"><strong>Funcionário:</strong> {selectedProcesso.funcionario ? selectedProcesso.funcionario.nome : '-'}</Typography>
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
          <Typography>Tem certeza que deseja excluir o usuário {selectedUsuario?.nome}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AllUsuarios;
