import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.nextra.net',
  withCredentials: true,
});

export default api;
