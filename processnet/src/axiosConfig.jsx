import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Atualize com a URL correta do seu backend
  withCredentials: true, // Enviar cookies junto com as requisições
});

export default instance;
