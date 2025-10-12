import { getCorsUrl, corsHeaders } from './corsProxy';

// Usar URL directa siempre (las rutas son /tickets, no /api/tickets)
const BASE_URL = 'https://tikets-halloween-7g5s.vercel.app';

class TicketService {
  // Función auxiliar para manejar respuestas
  async handleResponse(response) {
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      console.error('Error response:', response.status, responseText);
      throw new Error(`Error ${response.status}: ${responseText || response.statusText}`);
    }
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON:', responseText);
      throw new Error('Error al procesar la respuesta del servidor');
    }
  }

  // Crear un nuevo ticket
  async createTicket() {
    try {
      console.log('Creando ticket...');
      const response = await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: corsHeaders,
        mode: 'cors',
        credentials: 'omit',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw new Error(`Error al crear el ticket: ${error.message}`);
    }
  }

  // Obtener todos los tickets
  async getTickets() {
    try {
      console.log('Obteniendo tickets...');
      const response = await fetch(`${BASE_URL}/tickets`, {
        method: 'GET',
        headers: corsHeaders,
        mode: 'cors',
        credentials: 'omit',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw new Error(`Error al obtener los tickets: ${error.message}`);
    }
  }

  // Verificar un ticket
  async verifyTicket(token) {
    try {
      console.log('Verificando ticket:', token);
      const response = await fetch(`${BASE_URL}/tickets/verify/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al verificar ticket:', error);
      throw new Error(`Error al verificar el ticket: ${error.message}`);
    }
  }

  // Usar un ticket
  async useTicket(token) {
    try {
      console.log('Usando ticket:', token);
      const response = await fetch(`${BASE_URL}/tickets/use/${token}`, {
        method: 'POST',
        headers: corsHeaders,
        mode: 'cors',
        credentials: 'omit',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al usar ticket:', error);
      throw new Error(`Error al usar el ticket: ${error.message}`);
    }
  }

  // Eliminar ticket por token
  async deleteTicketByToken(token) {
    try {
      console.log('Eliminando ticket por token:', token);
      const response = await fetch(`${BASE_URL}/tickets/delete/${token}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar ticket por token:', error);
      throw new Error(`Error al eliminar el ticket: ${error.message}`);
    }
  }

  // Eliminar ticket por ID
  async deleteTicket(id) {
    try {
      console.log('Eliminando ticket por ID:', id);
      const response = await fetch(`${BASE_URL}/tickets/delete/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al eliminar ticket por ID:', error);
      throw new Error(`Error al eliminar el ticket: ${error.message}`);
    }
  }

  // Generar QR para un ticket
  async generateQR(token) {
    try {
      console.log('Generando QR para token:', token);
      const response = await fetch(`${BASE_URL}/tickets/${token}/qr`, {
        mode: 'cors',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al generar QR:', error);
      throw new Error(`Error al generar el QR: ${error.message}`);
    }
  }

  // Generar invitación con QR
  async generateInvitationWithQR(token) {
    try {
      console.log('Generando invitación para token:', token);
      const response = await fetch(`${BASE_URL}/tickets/${token}/invitation`, {
        mode: 'cors',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al generar invitación:', error);
      throw new Error(`Error al generar la invitación: ${error.message}`);
    }
  }
}

export default new TicketService();
