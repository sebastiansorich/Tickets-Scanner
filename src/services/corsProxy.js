import { getApiUrl, getCorsHeaders } from './corsConfig';

// Función para obtener URL con proxy CORS
export const getCorsUrl = (endpoint) => {
  return getApiUrl(endpoint);
};

// Headers para peticiones CORS
export const corsHeaders = getCorsHeaders();
