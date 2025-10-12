import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import QRScanner from './components/QRScanner';
import TicketAdmin from './pages/TicketAdmin';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-ghost me-2 text-warning"></i>
          Halloween Tickets
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-qrcode me-1"></i>
                Escáner
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                to="/admin"
              >
                <i className="fas fa-cogs me-1"></i>
                Administración
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div id="root">
        <Navigation />
        
        <main className="min-vh-100">
          <Routes>
            <Route path="/" element={<QRScanner />} />
            <Route path="/admin" element={<TicketAdmin />} />
          </Routes>
        </main>

        <footer className="bg-dark text-light py-4 mt-5">
          <div className="container text-center">
            <p className="mb-0">
              <i className="fas fa-ghost me-2 text-warning"></i>
              © 2024 Sistema de Tickets Halloween - Desarrollado con React
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
