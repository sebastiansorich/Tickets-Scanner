import React from 'react';

const TicketTable = ({ tickets, onViewInvitation, onShareWhatsApp, onDeleteTicket }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isUsed) => {
    return isUsed ? (
      <span className="badge bg-danger rounded-pill">
        <i className="fas fa-times-circle me-1"></i>
        Usado
      </span>
    ) : (
      <span className="badge bg-success rounded-pill">
        <i className="fas fa-check-circle me-1"></i>
        Disponible
      </span>
    );
  };

  const handleShareWhatsApp = (token) => {
    const message = `¡Hola! Te invito a la fiesta de Halloween 🎃👻\n\nTu ticket de acceso es: ${token}\n\n¡Nos vemos en la fiesta!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Mostrar feedback visual
      const button = event.target.closest('button');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add('btn-success');
      button.classList.remove('btn-outline-secondary');
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('btn-success');
        button.classList.add('btn-outline-secondary');
      }, 2000);
    });
  };

  return (
    <>
      {/* Vista de escritorio - Tabla */}
      <div className="d-none d-lg-block">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="border-0">
                  <i className="fas fa-hashtag me-2"></i>
                  ID
                </th>
                <th className="border-0">
                  <i className="fas fa-key me-2"></i>
                  Token
                </th>
                <th className="border-0">
                  <i className="fas fa-calendar me-2"></i>
                  Fecha de Emisión
                </th>
                <th className="border-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Estado
                </th>
                <th className="border-0 text-center">
                  <i className="fas fa-cogs me-2"></i>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id_ticket} className="align-middle">
                  <td>
                    <span className="fw-bold text-primary">#{ticket.id_ticket}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <code className="text-break me-2" style={{ fontSize: '0.75em', maxWidth: '200px' }}>
                        {ticket.token}
                      </code>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => copyToClipboard(ticket.token)}
                        title="Copiar token"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      {formatDate(ticket.date_of_issue)}
                    </small>
                  </td>
                  <td>{getStatusBadge(ticket.is_used)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => onViewInvitation(ticket.token)}
                        title="Ver Invitación"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleShareWhatsApp(ticket.token)}
                        title="Compartir por WhatsApp"
                      >
                        <i className="fab fa-whatsapp"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteTicket(ticket.id_ticket, ticket.token)}
                        title="Eliminar Ticket"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista móvil - Cards */}
      <div className="d-lg-none">
        {tickets.map((ticket) => (
          <div key={ticket.id_ticket} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="card-title mb-1">
                    <i className="fas fa-hashtag me-1 text-primary"></i>
                    Ticket #{ticket.id_ticket}
                  </h6>
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {formatDate(ticket.date_of_issue)}
                  </small>
                </div>
                {getStatusBadge(ticket.is_used)}
              </div>
              
              <div className="mb-3">
                <label className="form-label small fw-bold">
                  <i className="fas fa-key me-1"></i>
                  Token:
                </label>
                <div className="d-flex align-items-center">
                  <code className="text-break me-2 flex-grow-1" style={{ fontSize: '0.7em' }}>
                    {ticket.token}
                  </code>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => copyToClipboard(ticket.token)}
                    title="Copiar token"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => onViewInvitation(ticket.token)}
                  title="Ver Invitación"
                >
                  <i className="fas fa-eye me-1"></i>
                  Ver
                </button>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => handleShareWhatsApp(ticket.token)}
                  title="Compartir por WhatsApp"
                >
                  <i className="fab fa-whatsapp me-1"></i>
                  WhatsApp
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteTicket(ticket.id_ticket, ticket.token)}
                  title="Eliminar Ticket"
                >
                  <i className="fas fa-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TicketTable;
