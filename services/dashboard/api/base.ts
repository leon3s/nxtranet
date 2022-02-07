import axios from 'axios';

const api = axios.create({
  baseURL: `http://api.${process.env.NXTRANET_DOMAIN}`,
  withCredentials: true,
});

export default api;
