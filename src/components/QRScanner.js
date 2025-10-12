import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import ticketService from '../services/ticketService';

const QRScanner = () => {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = (result) => {
    if (result.length > 0) {
      const data = result[0].rawValue;
      setQrData(data);
      sendQrDataToApi(data);
      setScanning(false); // Desactivamos el escáner después de leer
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error al escanear el código QR');
    setScanning(false);
  };

  const sendQrDataToApi = async (token) => {
    setLoading(true);
    try {
      console.log('Enviando token a la API:', token);
      const result = await ticketService.useTicket(token);
      console.log('Respuesta de la API:', result);
      setApiResponse(result.message || 'Código QR verificado correctamente');
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error('Error en sendQrDataToApi:', err);
      setApiResponse(`Error al verificar el código QR: ${err.message}`);
      setError(null); // Limpiar errores de escaneo
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setQrData(null);
    setError(null);
    setApiResponse(null);
  };

  const testWithSampleToken = () => {
    const sampleToken = 'CaELtnjLG82bZ_RTQnd4I51C69xNc85Yj8wLc9pZLQU';
    setQrData(sampleToken);
    sendQrDataToApi(sampleToken);
  };

  const previewStyle = {
    height: 240,
    width: 320,
    margin: 'auto',
  };

  // Configuración de constraints para usar la cámara trasera
  const constraints = {
    video: {
      facingMode: { exact: 'environment' }
    }
  };

  return (
    <div className="container mt-5 text-center content">
      <h2 className="mb-4">
        <i className="fas fa-qrcode me-2"></i>
        Escáner de Tickets
      </h2>
      
      {qrData && (
        <div className="alert alert-info">
          <strong>Token escaneado:</strong> {qrData}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
      
      {apiResponse && (
        <div className={`alert ${apiResponse.includes('verificado') || apiResponse.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>
          <i className={`fas ${apiResponse.includes('verificado') || apiResponse.includes('correctamente') ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
          {apiResponse}
        </div>
      )}

      {loading && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Verificando ticket...
        </div>
      )}

      <div className="mt-3">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={clearMessages}
        >
          <i className="fas fa-eraser me-1"></i>
          Limpiar
        </button>
        <button
          className="btn btn-outline-info"
          onClick={testWithSampleToken}
          disabled={loading}
        >
          <i className="fas fa-flask me-1"></i>
          Probar con Token de Ejemplo
        </button>
      </div>

      {!scanning ? (
        <button
          className="btn btn-primary btn-lg mt-4"
          onClick={() => setScanning(true)}
        >
          <i className="fas fa-camera me-2"></i>
          Escanear QR
        </button>
      ) : (
        <div>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={constraints}
            scanDelay={300}
            style={previewStyle}
          />
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setScanning(false)}
          >
            <i className="fas fa-stop me-2"></i>
            Detener
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
