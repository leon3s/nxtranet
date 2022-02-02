import axios from 'axios';

const config = require('../../../.nxt.json');

const api = axios.create({
  baseURL: `http://api.${config.domain}`,
  withCredentials: true,
});

export default api;
