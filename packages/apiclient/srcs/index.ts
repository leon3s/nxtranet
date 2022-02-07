import axios from 'axios';

const apiUrl = process.env.API_URL || 'http://api.nextra.net';

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});
