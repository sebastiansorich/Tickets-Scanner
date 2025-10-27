import React, { useState, useMemo } from 'react';
import pdfService from '../services/pdfService';

const TicketTable = ({ tickets, onDeleteTicket }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' o 'oldest'
  const itemsPerPage = 10;

  // Ordenar tickets por fecha
  const sortedTickets = useMemo(() => {
    const sorted = [...tickets].sort((a, b) => {
      const dateA = new Date(a.date_of_issue);
      const dateB = new Date(b.date_of_issue);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [tickets, sortOrder]);

  // Calcular tickets paginados
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTickets.slice(startIndex, endIndex);
  }, [sortedTickets, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

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

  const handleViewInvitation = (token) => {
    const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
    window.open(invitationUrl, '_blank');
  };

  const handleDownloadPDF = async (idTicket, token, event) => {
    try {
      // Mostrar indicador de carga
      const button = event.target.closest('button');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;
      
      // Generar PDF
      const pdfBlob = await pdfService.generateInvitationPDF(token);
      
      // Descargar PDF
      pdfService.downloadPDF(pdfBlob, `Halloween-2025-${idTicket}.pdf`);
      
      // Restaurar botón
      button.innerHTML = originalHTML;
      button.disabled = false;
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      
      // Restaurar botón en caso de error
      const button = event.target.closest('button');
      button.innerHTML = '<i class="fas fa-download"></i>';
      button.disabled = false;
      
      alert('Error al generar el PDF. Intenta nuevamente.');
    }
  };

  const handleShareWhatsApp = async (token, event) => {
    try {
      // Mostrar indicador de carga
      const button = event.target.closest('button');
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;
      
      // Generar y compartir PDF
      await pdfService.sharePDFByWhatsApp(token);
      
      // Restaurar botón
      button.innerHTML = originalHTML;
      button.disabled = false;
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error);
      
      // Restaurar botón en caso de error
      const button = event.target.closest('button');
      button.innerHTML = '<i class="fab fa-whatsapp"></i>';
      button.disabled = false;
      
      // Fallback: compartir URL
      const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
      const message = `🎃👻\n\n${invitationUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const copyToClipboard = (text, event) => {
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

  // Funciones de paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset a la primera página
  };

  // Generar números de página
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <>
      {/* Filtros y controles */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <label className="form-label me-3 mb-0 text-white">
              <i className="fas fa-sort me-2 text-white"></i>
              Ordenar por fecha:
            </label>
            <select 
              className="form-select" 
              value={sortOrder} 
              onChange={(e) => handleSortChange(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="newest">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
            </select>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <span className="text-muted">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedTickets.length)} de {sortedTickets.length} tickets
          </span>
        </div>
      </div>

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
              {paginatedTickets.map((ticket) => (
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
                        onClick={(e) => copyToClipboard(ticket.token, e)}
                        title="Copiar token"
                      >
                        <i className="fas fa-copy text-black"></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <small className="text-muted text-black">
                      <i className="fas fa-clock me-1 text-white"></i>
                      {formatDate(ticket.date_of_issue)}
                    </small>
                  </td>
                  <td>{getStatusBadge(ticket.is_used)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => handleViewInvitation(ticket.token)}
                        title="Ver Invitación"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => handleDownloadPDF(ticket.id_ticket, ticket.token, e)}
                        title="Descargar PDF"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={(e) => handleShareWhatsApp(ticket.token, e)}
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
        
        {/* Paginación para escritorio */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Paginación de tickets">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                {getPageNumbers().map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Vista móvil - Cards */}
      <div className="d-lg-none">
        {paginatedTickets.map((ticket) => (
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
                    onClick={(e) => copyToClipboard(ticket.token, e)}
                    title="Copiar token"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => handleViewInvitation(ticket.token)}
                  title="Ver Invitación"
                >
                  <i className="fas fa-eye me-1"></i>
                  Ver
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={(e) => handleDownloadPDF(ticket.id_ticket, ticket.token, e)}
                  title="Descargar PDF"
                >
                  <i className="fas fa-download me-1"></i>
                  PDF
                </button>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={(e) => handleShareWhatsApp(ticket.token, e)}
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
        
        {/* Paginación para móvil */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Paginación de tickets">
              <ul className="pagination pagination-sm">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                {getPageNumbers().map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

export default TicketTable;
