import axios from 'axios';

const api = axios.create({
  baseURL: 'partspluseg.com',
});

export default api;
