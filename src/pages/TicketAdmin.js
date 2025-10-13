import React, { useState, useEffect } from 'react';
import TicketTable from '../components/TicketTable';
import ticketService from '../services/ticketService';
import pdfService from '../services/pdfService';

const TicketAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicket, setNewTicket] = useState(null);

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
      const createdTicket = await ticketService.createTicket();
      setNewTicket(createdTicket);
      setShowCreateModal(true);
      await loadTickets(); // Recargar la lista
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

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewTicket(null);
  };

  const handleViewInvitationFromModal = (token) => {
    const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
    window.open(invitationUrl, '_blank');
  };

  const handleDownloadPDFFromModal = async (token) => {
    try {
      const pdfBlob = await pdfService.generateInvitationPDF(token);
      pdfService.downloadPDF(pdfBlob, `invitacion-halloween-${token}.pdf`);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al generar el PDF. Intenta nuevamente.');
    }
  };

  const handleShareWhatsAppFromModal = async (token) => {
    try {
      await pdfService.sharePDFByWhatsApp(token);
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error);
      // Fallback: compartir URL
      const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
      const message = `🎃👻\n\n${invitationUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
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

      {/* Modal de creación de ticket */}
      {showCreateModal && newTicket && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-check-circle me-2 text-success"></i>
                  ¡Ticket Creado Exitosamente!
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCreateModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-ticket-alt me-2"></i>
                  Se ha creado un nuevo ticket con el ID #{newTicket.id_ticket}
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-hashtag me-2"></i>ID del Ticket:</h6>
                    <p className="fw-bold text-primary">#{newTicket.id_ticket}</p>
                  </div>
                  <div className="col-md-6">
                    <h6><i className="fas fa-key me-2"></i>Token:</h6>
                    <code className="d-block text-break">{newTicket.token}</code>
                  </div>
                </div>

                <div className="mt-4">
                  <h6><i className="fas fa-magic me-2"></i>Acciones Disponibles:</h6>
                  <p className="text-muted">Puedes realizar las siguientes acciones con tu nuevo ticket:</p>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button
                      className="btn btn-outline-info"
                      onClick={() => handleViewInvitationFromModal(newTicket.token)}
                      title="Ver Invitación"
                    >
                      <i className="fas fa-eye me-2"></i>
                      Ver Invitación
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleDownloadPDFFromModal(newTicket.token)}
                      title="Descargar PDF"
                    >
                      <i className="fas fa-download me-2"></i>
                      Descargar PDF
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => handleShareWhatsAppFromModal(newTicket.token)}
                      title="Compartir por WhatsApp"
                    >
                      <i className="fab fa-whatsapp me-2"></i>
                      Compartir WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCreateModal}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    closeCreateModal();
                    // Scroll to top of page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <i className="fas fa-list me-2"></i>
                  Ver Lista de Tickets
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
