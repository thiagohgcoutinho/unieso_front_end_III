import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Modal } from '@mui/material';
import axios from '../axiosConfig';
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SelectProcess = () => {
  const { user } = useAuth();
  const [processos, setProcessos] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await axios.get(`/api/processos/tipo/${user.cargo === 'VISTORIADOR' ? 'VISTORIA' : 'ANALISE'}`);
        const filteredProcessos = response.data.filter(processo => processo.status === 'AGUARDANDO');
        setProcessos(filteredProcessos);
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
        toast.error('Erro ao buscar processos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcessos();
  }, [user.cargo]);

  const handleSelectProcess = async (processo) => {
    setSelectedProcess(processo);
    setIsModalOpen(true);
  };

  const handleConfirmSelect = async () => {
    try {
      const requestData = {
        idPessoa: user.idPessoa,
        cargo: user.cargo
      };

      await axios.put(`/api/processos/${selectedProcess.id}/selecionar`, requestData);
      toast.success('Processo selecionado com sucesso!');
      setProcessos(processos.filter(p => p.id !== selectedProcess.id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao selecionar processo:', error);
      toast.error(`Erro ao selecionar processo: ${error.response?.data || error.message}. Por favor, tente novamente.`);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" component="h1" gutterBottom>
        Selecionar Processo
      </Typography>
      <List>
        {processos.map((processo) => (
          <ListItem button key={processo.id} onClick={() => handleSelectProcess(processo)}>
            <ListItemText primary={`Protocolo: ${processo.numeroProtocolo}`} secondary={`Endereço: ${processo.endereco}`} />
          </ListItem>
        ))}
      </List>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar Seleção
          </Typography>
          <Typography variant="body1" gutterBottom>
            Deseja selecionar o processo de número de protocolo {selectedProcess?.numeroProtocolo}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setIsModalOpen(false)} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSelect} variant="contained" color="primary">
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SelectProcess;
