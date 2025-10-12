import React, { useState } from 'react';
import ticketService from '../services/ticketService';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpointName, testFunction) => {
    setLoading(true);
    try {
      console.log(`Probando ${endpointName}...`);
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [endpointName]: { success: true, data: result }
      }));
      console.log(`${endpointName} exitoso:`, result);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpointName]: { success: false, error: error.message }
      }));
      console.error(`${endpointName} falló:`, error);
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    setTestResults({});
    
    // Probar GET tickets
    await testEndpoint('GET /tickets', () => ticketService.getTickets());
    
    // Probar POST tickets (crear)
    await testEndpoint('POST /tickets', () => ticketService.createTicket());
    
    // Probar con un token existente
    const testToken = 'CaELtnjLG82bZ_RTQnd4I51C69xNc85Yj8wLc9pZLQU';
    await testEndpoint('POST /tickets/verify', () => ticketService.verifyTicket(testToken));
    
    // Probar usar ticket (debería fallar porque ya está usado)
    await testEndpoint('POST /tickets/use', () => ticketService.useTicket(testToken));
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-vial me-2"></i>
            Prueba de Endpoints API
          </h5>
        </div>
        <div className="card-body">
          <button
            className="btn btn-primary mb-3"
            onClick={testAllEndpoints}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Probando...
              </>
            ) : (
              <>
                <i className="fas fa-play me-2"></i>
                Probar Todos los Endpoints
              </>
            )}
          </button>

          <div className="row">
            {Object.entries(testResults).map(([endpoint, result]) => (
              <div key={endpoint} className="col-md-6 mb-3">
                <div className={`card ${result.success ? 'border-success' : 'border-danger'}`}>
                  <div className="card-body">
                    <h6 className="card-title d-flex align-items-center">
                      {result.success ? (
                        <i className="fas fa-check-circle text-success me-2"></i>
                      ) : (
                        <i className="fas fa-times-circle text-danger me-2"></i>
                      )}
                      {endpoint}
                    </h6>
                    {result.success ? (
                      <div>
                        <p className="text-success mb-1">✅ Exitoso</p>
                        <small className="text-muted">
                          Datos recibidos: {Array.isArray(result.data) ? result.data.length : 1} elemento(s)
                        </small>
                        {result.data && typeof result.data === 'object' && (
                          <div className="mt-2">
                            <small className="text-muted">
                              <pre style={{fontSize: '0.7em', maxHeight: '100px', overflow: 'auto'}}>
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-danger mb-1">❌ Error</p>
                        <small className="text-danger">{result.error}</small>
                        {result.error.includes('Database error') && (
                          <div className="mt-2">
                            <small className="text-warning">
                              <i className="fas fa-database me-1"></i>
                              Problema de base de datos en el servidor
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(testResults).length === 0 && (
            <div className="text-center text-muted py-4">
              <i className="fas fa-info-circle fa-2x mb-3"></i>
              <p>Haz clic en "Probar Todos los Endpoints" para verificar la conectividad con la API</p>
              <div className="alert alert-info mt-3">
                <h6><i className="fas fa-server me-2"></i>Estado del Servidor</h6>
                <p className="mb-1"><strong>URL Base:</strong> https://tikets-halloween-7g5s.vercel.app</p>
                <p className="mb-1"><strong>Modo:</strong> {process.env.NODE_ENV === 'development' ? 'Desarrollo' : 'Producción'}</p>
                <p className="mb-0"><strong>Rutas:</strong> /tickets (sin prefijo /api)</p>
              </div>
            </div>
          )}

          {Object.keys(testResults).length > 0 && (
            <div className="mt-4">
              <div className="alert alert-warning">
                <h6><i className="fas fa-exclamation-triangle me-2"></i>Diagnóstico</h6>
                <p className="mb-1">Según los logs de Vercel:</p>
                <ul className="mb-0">
                  <li>✅ <strong>GET /tickets</strong> → 200 OK (funciona)</li>
                  <li>✅ <strong>POST /tickets</strong> → 201 Created (funciona)</li>
                  <li>✅ <strong>CORS</strong> → OPTIONS requests funcionan</li>
                  <li>❌ <strong>/api/tickets</strong> → 404 (ruta incorrecta)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
