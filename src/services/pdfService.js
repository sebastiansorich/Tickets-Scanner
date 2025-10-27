import jsPDF from 'jspdf';
import { getCorsUrl } from './corsProxy';

class PDFService {
  // Generar PDF de la imagen de invitación
  async generateInvitationPDF(token) {
    try {
      const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
      
      // Crear un nuevo PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Intentar cargar la imagen con diferentes métodos
      try {
        // Método 1: Usar proxy CORS para obtener la imagen como blob
        const corsUrl = getCorsUrl(`/tickets/${token}/invitation`);
        const response = await fetch(corsUrl, {
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        
        // Crear imagen desde blob
        const img = new Image();
        
        return new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              // Calcular dimensiones para que la imagen CUBRA toda la página A4 (sin bordes)
              const pageWidth = 210; // mm (ancho A4)
              const pageHeight = 297; // mm (alto A4)
              
              // Escalado tipo "cover": asegura cubrir por completo, pudiendo recortar
              const scale = Math.max(pageWidth / img.width, pageHeight / img.height);
              const bleed = 1; // mm de sangrado para evitar líneas blancas
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (pageWidth - scaledWidth) / 2 - bleed;
              const y = (pageHeight - scaledHeight) / 2 - bleed;
              
              // Agregar la imagen ligeramente sobredimensionada para eliminar bordes
              pdf.addImage(img, 'PNG', x, y, scaledWidth + 2 * bleed, scaledHeight + 2 * bleed);
              
              // Limpiar URL del blob
              URL.revokeObjectURL(imgUrl);
              
              // Generar el PDF como blob
              const pdfBlob = pdf.output('blob');
              resolve(pdfBlob);
            } catch (error) {
              URL.revokeObjectURL(imgUrl);
              reject(error);
            }
          };
          
          img.onerror = () => {
            URL.revokeObjectURL(imgUrl);
            reject(new Error('Error al procesar la imagen'));
          };
          
          // Cargar la imagen
          img.src = imgUrl;
        });
        
      } catch (fetchError) {
        console.log('Fetch falló, intentando método alternativo:', fetchError);
        
        // Método 2: Cargar imagen directamente (puede fallar por CORS)
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              // Calcular dimensiones para que la imagen CUBRA toda la página A4 (sin bordes)
              const pageWidth = 210; // mm (ancho A4)
              const pageHeight = 297; // mm (alto A4)
              
              // Escalado tipo "cover": asegura cubrir por completo, pudiendo recortar
              const scale = Math.max(pageWidth / img.width, pageHeight / img.height);
              const bleed = 1; // mm de sangrado para evitar líneas blancas
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (pageWidth - scaledWidth) / 2 - bleed;
              const y = (pageHeight - scaledHeight) / 2 - bleed;
              
              // Agregar la imagen ligeramente sobredimensionada para eliminar bordes
              pdf.addImage(img, 'PNG', x, y, scaledWidth + 2 * bleed, scaledHeight + 2 * bleed);
              
              // Generar el PDF como blob
              const pdfBlob = pdf.output('blob');
              resolve(pdfBlob);
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => {
            console.log('Error al cargar imagen, generando PDF sin imagen');
            // Método 3: Generar PDF sin imagen como último recurso
            try {
              // Agregar mensaje de que la imagen no se pudo cargar
              pdf.setFontSize(14);
              pdf.setTextColor(100, 100, 100);
              pdf.text('Imagen de invitación no disponible', 105, 100, { align: 'center' });
              pdf.text('Puedes ver la invitación en:', 105, 120, { align: 'center' });
              pdf.setFontSize(10);
              pdf.text(invitationUrl, 105, 140, { align: 'center' });
              
              // (Sin pie de página para permitir pantalla completa)
              
              // Generar el PDF como blob
              const pdfBlob = pdf.output('blob');
              resolve(pdfBlob);
            } catch (fallbackError) {
              reject(new Error('Error al generar PDF de respaldo'));
            }
          };
          
          // Cargar la imagen
          img.src = invitationUrl;
        });
      }
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error(`Error al generar el PDF: ${error.message}`);
    }
  }

  // Descargar PDF
  downloadPDF(pdfBlob, filename) {
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'invitacion-halloween.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Compartir PDF por WhatsApp
  async sharePDFByWhatsApp(token) {
    try {
      // Generar el PDF
      const pdfBlob = await this.generateInvitationPDF(token);
      
      // Crear archivo para compartir
      const fileName = `invitacion-halloween-${token}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      // Intentar usar Web Share API nativa (funciona en móviles)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Invitación Halloween - Urubó West',
            text: '¡Te invito a la fiesta de Halloween! 🎃👻',
            files: [file]
          });
          return; // Si funciona, no hacer nada más
        } catch (shareError) {
          console.log('Web Share API falló, usando método alternativo');
        }
      }
      
      // Método alternativo: descargar y mostrar instrucciones
      this.downloadPDF(pdfBlob, fileName);
      
      // Mostrar mensaje informativo
      const message = `¡Hola! Te invito a la fiesta de Halloween 🎃👻\n\nHe descargado tu invitación en PDF. Busca el archivo "${fileName}" en tu carpeta de descargas y compártelo por WhatsApp. ¡Nos vemos en la fiesta!`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Mostrar notificación adicional
      setTimeout(() => {
        alert('📄 PDF descargado exitosamente!\n\nEl archivo se ha guardado en tu carpeta de descargas. Ahora puedes compartirlo por WhatsApp desde tu dispositivo.');
      }, 1000);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      // Fallback: compartir URL de la imagen
      const invitationUrl = `https://tikets-halloween-7g5s.vercel.app/tickets/${token}/invitation`;
      const message = `🎃👻`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }
}

export default new PDFService();
