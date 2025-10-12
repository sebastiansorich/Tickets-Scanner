import React, { useState, useEffect } from 'react';
import TicketTable from '../components/TicketTable';
import ticketService from '../services/ticketService';

const TicketAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      setLoading(true);
      const newTicket = await ticketService.createTicket();
      await loadTickets(); // Recargar la lista
      alert('Ticket creado exitosamente');
    } catch (err) {
      alert('Error al crear el ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvitation = async (token) => {
    try {
      setLoading(true);
      const invitation = await ticketService.generateInvitationWithQR(token);
      setModalContent({
        title: 'Invitación',
        content: invitation,
        type: 'invitation'
      });
      setShowModal(true);
    } catch (err) {
      alert('Error al generar la invitación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (id, token) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      try {
        setLoading(true);
        await ticketService.deleteTicket(id);
        await loadTickets(); // Recargar la lista
        alert('Ticket eliminado exitosamente');
      } catch (err) {
        alert('Error al eliminar el ticket');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando tickets...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="fas fa-ticket-alt me-2"></i>
              Administración de Tickets - Fiesta Halloween
            </h2>
            <button
              className="btn btn-primary"
              onClick={handleCreateTicket}
              disabled={loading}
            >
              <i className="fas fa-plus me-2"></i>
              Crear Nuevo Ticket
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {tickets.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No hay tickets disponibles</h4>
              <p className="text-muted">Crea tu primer ticket para comenzar</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Lista de Tickets ({tickets.length})
                </h5>
              </div>
              <div className="card-body p-0">
                <TicketTable
                  tickets={tickets}
                  onViewInvitation={handleViewInvitation}
                  onShareWhatsApp={() => {}} // Se maneja directamente en el componente
                  onDeleteTicket={handleDeleteTicket}
                />
              </div>
            </div>
          )}

          {loading && tickets.length > 0 && (
            <div className="text-center mt-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para mostrar invitaciones */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-envelope me-2"></i>
                  {modalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalContent.type === 'invitation' && (
                  <div>
                    <p className="text-muted mb-3">
                      Aquí tienes la información de la invitación:
                    </p>
                    <div className="bg-light p-3 rounded">
                      <pre className="mb-0">{JSON.stringify(modalContent.content, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketAdmin;
