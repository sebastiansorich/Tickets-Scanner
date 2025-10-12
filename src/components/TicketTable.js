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
      <span className="badge bg-danger">Usado</span>
    ) : (
      <span className="badge bg-success">Disponible</span>
    );
  };

  const handleShareWhatsApp = (token) => {
    const message = `¡Hola! Te invito a la fiesta de Halloween 🎃👻\n\nTu ticket de acceso es: ${token}\n\n¡Nos vemos en la fiesta!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Token</th>
            <th>Fecha de Emisión</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id_ticket}>
              <td>{ticket.id_ticket}</td>
              <td>
                <code className="text-break" style={{ fontSize: '0.8em' }}>
                  {ticket.token}
                </code>
              </td>
              <td>{formatDate(ticket.date_of_issue)}</td>
              <td>{getStatusBadge(ticket.is_used)}</td>
              <td>
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => onViewInvitation(ticket.token)}
                    title="Ver Invitación"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleShareWhatsApp(ticket.token)}
                    title="Compartir por WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
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
  );
};

export default TicketTable;
