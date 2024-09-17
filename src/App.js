import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const scannerRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setQrData(data.text);
      sendQrDataToApi(data.text);
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
      const response = await fetch(`http://127.0.0.1:4000/tickets/use/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setApiResponse(result.message || 'Código QR verificado');
    } catch (err) {
      setApiResponse('Error al verificar el código QR');
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
    margin: 'auto',
  };

  useEffect(() => {
    // Accede a la lista de dispositivos de cámara y selecciona la cámara trasera si está disponible
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          // Seleccionar la cámara trasera
          const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];
          setCameraId(rearCamera.deviceId);
        }
      } catch (err) {
        console.error('Error al obtener cámaras', err);
      }
    };

    getCameras();
  }, []);

  return (
    <div id="root">
      <nav className="navbar navbar-light bg-light shadow-lg p-3 mb-5 bg-white rounded">
        <div className="container justify-content-between">
          <span className="navbar-brand mb-0 h1 mx-auto">QR APP SCANNER</span>
          
          {/* Icono de usuario a la derecha */}
          <button className="btn">
            <i className="fas fa-user fa-2x"></i>
          </button>
        </div>
      </nav>

      <div className="container mt-5 text-center content">
        {qrData && (
          <p className="mt-3">
            <strong>Datos del QR:</strong> {qrData}
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
            Activar Escáner
          </button>
        ) : (
          <div>
            <QrScanner
              delay={300}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
              facingMode={{ exact: 'environment' }} // Usa la cámara trasera
              ref={scannerRef}
            />
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setScanning(false)}
            >
              Detener Escáner
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
