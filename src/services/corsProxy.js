// Proxy CORS alternativo para desarrollo
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://tikets-halloween-7g5s.vercel.app';

export const getCorsUrl = (endpoint) => {
  return `${CORS_PROXY}${BASE_URL}${endpoint}`;
};

export const corsHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};
