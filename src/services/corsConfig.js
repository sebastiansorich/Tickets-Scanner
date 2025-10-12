// Configuración de CORS - Opciones disponibles
export const CORS_OPTIONS = {
  // Opción 1: Proxy CORS público (puede ser lento o no estar disponible)
  CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
  
  // Opción 2: Proxy CORS alternativo más confiable
  CORS_PROXY_ALT: 'https://api.allorigins.win/raw?url=',
  
  // Opción 3: Proxy CORS adicional
  CORS_PROXY_ALT2: 'https://corsproxy.io/?',
  
  // Opción 4: Sin proxy (requiere que el servidor permita CORS)
  NO_PROXY: null
};

// Configuración actual - cambiar aquí para probar diferentes opciones
// Prueba primero con CORS_PROXY_ALT2 que suele ser más confiable
export const CURRENT_CORS_OPTION = CORS_OPTIONS.CORS_PROXY_ALT2;

// URL base de la API
export const API_BASE_URL = 'https://tikets-halloween-7g5s.vercel.app';

// Función para obtener la URL con proxy si es necesario
export const getApiUrl = (endpoint) => {
  if (CURRENT_CORS_OPTION) {
    return `${CURRENT_CORS_OPTION}${API_BASE_URL}${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};

// Headers para las peticiones
export const getCorsHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Agregar headers específicos para cors-anywhere
  if (CURRENT_CORS_OPTION === CORS_OPTIONS.CORS_PROXY) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  
  return headers;
};
