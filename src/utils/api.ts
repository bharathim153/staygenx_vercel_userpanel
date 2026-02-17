// utils/api.ts
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
