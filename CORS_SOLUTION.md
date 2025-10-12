# Solución para Error CORS

## Problema
El error CORS ocurre porque el servidor `https://tikets-halloween-7g5s.vercel.app` no permite peticiones desde tu dominio `https://tickets-scanner-git-main-sebastians-projects-d9860632.vercel.app`.

## Solución Implementada
He configurado un sistema de proxy CORS que permite cambiar fácilmente entre diferentes opciones.

## Cómo Probar Diferentes Opciones

### Opción 1: Proxy CORS más confiable (Recomendado)
En `src/services/corsConfig.js`, línea 18:
```javascript
export const CURRENT_CORS_OPTION = CORS_OPTIONS.CORS_PROXY_ALT2;
```

### Opción 2: Proxy CORS alternativo
En `src/services/corsConfig.js`, línea 18:
```javascript
export const CURRENT_CORS_OPTION = CORS_OPTIONS.CORS_PROXY_ALT;
```

### Opción 3: Proxy CORS original
En `src/services/corsConfig.js`, línea 18:
```javascript
export const CURRENT_CORS_OPTION = CORS_OPTIONS.CORS_PROXY;
```

### Opción 4: Sin proxy (si el servidor permite CORS)
En `src/services/corsConfig.js`, línea 18:
```javascript
export const CURRENT_CORS_OPTION = CORS_OPTIONS.NO_PROXY;
```

## Pasos para Probar

1. Cambia la opción en `corsConfig.js`
2. Guarda el archivo
3. Recarga la aplicación
4. Prueba la funcionalidad

## Si Ninguna Opción Funciona

### Solución Alternativa: Crear tu propio proxy
Puedes crear un endpoint en tu aplicación que actúe como proxy:

```javascript
// En tu servidor backend
app.get('/api/proxy/tickets', async (req, res) => {
  try {
    const response = await fetch('https://tikets-halloween-7g5s.vercel.app/tickets');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Solución Definitiva: Configurar CORS en el servidor
Si tienes acceso al servidor `tikets-halloween-7g5s.vercel.app`, agrega estos headers:

```javascript
// En el servidor de la API
app.use(cors({
  origin: ['https://tickets-scanner-git-main-sebastians-projects-d9860632.vercel.app'],
  credentials: true
}));
```

## Estado Actual
- ✅ Proxy CORS configurado
- ✅ Múltiples opciones disponibles
- ✅ Fácil cambio entre opciones
- ⏳ Pendiente: Probar la solución
