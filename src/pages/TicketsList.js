import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import './TicketsList.css';

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prueba simple del fetch
    console.log('Componente montado, iniciando carga...');
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando fetch a la API...');
      
      const data = await ticketService.getTickets();
      console.log('Datos recibidos:', data);
      setTickets(data);
    } catch (err) {
      console.error('Error completo:', err);
      setError(`Error al cargar los tickets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (isUsed) => {
    return (
      <span className={`status-badge ${isUsed ? 'used' : 'available'}`}>
        {isUsed ? 'Usado' : 'Disponible'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="tickets-container">
        <div className="loading">
          <h2>Cargando tickets...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-container">
        <div className="error">
          <h2>Error al cargar los tickets</h2>
          <p>{error}</p>
          <button onClick={loadTickets} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>🎫 Lista de Tickets</h1>
        <button onClick={loadTickets} className="refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      <div className="tickets-stats">
        <div className="stat">
          <span className="stat-number">{tickets.length}</span>
          <span className="stat-label">Total Tickets</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {tickets.filter(ticket => !ticket.is_used).length}
          </span>
          <span className="stat-label">Disponibles</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {tickets.filter(ticket => ticket.is_used).length}
          </span>
          <span className="stat-label">Usados</span>
        </div>
      </div>

      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="no-tickets">
            <p>No hay tickets disponibles</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id_ticket} className="ticket-card">
              <div className="ticket-header">
                <h3>Ticket #{ticket.id_ticket}</h3>
                {getStatusBadge(ticket.is_used)}
              </div>
              
              <div className="ticket-details">
                <div className="detail-row">
                  <span className="label">Fecha de emisión:</span>
                  <span className="value">{formatDate(ticket.date_of_issue)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Token:</span>
                  <span className="value token">{ticket.token}</span>
                </div>
                
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span className="value">
                    {ticket.is_used ? '❌ Usado' : '✅ Disponible'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsList;
