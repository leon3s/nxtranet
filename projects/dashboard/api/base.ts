import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.nxtranet.com',
  withCredentials: true,
});

export default api;
