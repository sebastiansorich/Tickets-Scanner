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
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-ghost me-2"></i>
          Halloween Tickets
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ color: '#ffffff' }}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-qrcode me-2"></i>
                Escáner
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                to="/admin"
              >
                <i className="fas fa-cogs me-2"></i>
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

        <footer className="py-4 mt-5">
          <div className="container text-center">
            <p className="mb-0">
              <i className="fas fa-ghost me-2" style={{ color: '#3b82f6' }}></i>
              © 2025 Sistema de Tickets Urubo west
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
