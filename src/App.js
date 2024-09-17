import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [scanning, setScanning] = useState(false);

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
    try {
      const response = await fetch(`https://tiketshalloween.onrender.com/tickets/use/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setApiResponse(result.message || 'Código QR verificado correctamente');
    } catch (err) {
      setApiResponse('Error al verificar el código QR');
    }
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
    <div id="root">
      <nav className="navbar navbar-light bg-light shadow-md p-3 mb-4 bg-white rounded">
        <div className="container justify-content-between">
          <span className="navbar-brand mb-0 h1 mx-auto">Lector de Qr</span>
          
          {/* Icono de usuario a la derecha */}
          <button className="btn">
            <i className="fas fa-user fa-2x"></i>
          </button>
        </div>
      </nav>

      <div className="container mt-5 text-center content">
        {qrData && (
          <p className="mt-3">
            <strong>Token:</strong> {qrData}
          </p>
        )}
        {error && (
          <p className="mt-3 text-danger">
            {error}
          </p>
        )}
        {apiResponse && (
          <p className={`mt-3 ${apiResponse.includes('verificado') ? 'text-success' : 'text-danger'}`}>
            {apiResponse}
          </p>
        )}

        {!scanning ? (
          <button
            className="btn btn-primary mt-4"
            onClick={() => setScanning(true)}
          >
            Escanear qr
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
              Detener
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        © 2024 QR App Scanner
      </footer>
    </div>
  );
}

export default App;
