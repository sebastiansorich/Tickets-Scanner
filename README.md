# Sistema de Tickets Halloween 🎃👻

Una aplicación React para gestionar tickets virtuales para una fiesta de Halloween, con funcionalidades de escaneo QR y administración completa.

## 🚀 Características

- **Escáner QR**: Escanea tickets usando la cámara del dispositivo
- **Administración de Tickets**: Panel completo para gestionar todos los tickets
- **CRUD Completo**: Crear, ver, eliminar tickets
- **Compartir por WhatsApp**: Envía invitaciones directamente por WhatsApp
- **Interfaz Moderna**: Diseño con tema Halloween y efectos glassmorphism
- **Responsive**: Funciona perfectamente en móviles y escritorio

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── QRScanner.js          # Componente del escáner QR
│   └── TicketTable.js        # Tabla para mostrar tickets
├── pages/
│   └── TicketAdmin.js        # Página de administración
├── services/
│   └── ticketService.js      # Servicio para manejar API
├── App.js                    # Componente principal con rutas
├── App.css                   # Estilos personalizados
└── index.js                  # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **React 18**
- **React Router DOM** - Para navegación
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconos
- **@yudiel/react-qr-scanner** - Escáner QR

## 🔗 Endpoints de la API

La aplicación se conecta a: `https://tikets-halloween-7g5s.vercel.app/`

### Endpoints disponibles:
- `POST /tickets` - Crear nuevo ticket
- `GET /tickets` - Obtener todos los tickets
- `POST /tickets/verify/<token>` - Verificar ticket
- `POST /tickets/use/<token>` - Usar ticket
- `DELETE /tickets/delete/<token>` - Eliminar por token
- `DELETE /tickets/delete/<id>` - Eliminar por ID
- `GET /tickets/<token>/qr` - Generar QR
- `GET /tickets/<token>/invitation` - Generar invitación

## 🎯 Funcionalidades

### Escáner QR (`/`)
- Escanea códigos QR de tickets
- Usa la cámara trasera del dispositivo
- Verifica automáticamente el ticket
- Muestra estado de verificación

### Administración (`/admin`)
- **Lista de Tickets**: Tabla con todos los tickets disponibles
- **Crear Ticket**: Botón para generar nuevos tickets
- **Acciones por Ticket**:
  - 👁️ Ver invitación
  - 📱 Compartir por WhatsApp
  - 🗑️ Eliminar ticket

## 🎨 Diseño

- **Tema Halloween**: Colores naranjas y negros
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Responsive**: Adaptable a todos los dispositivos
- **Animaciones**: Transiciones suaves y efectos hover

## 🚀 Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

3. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📱 Uso de la Aplicación

### Para Escanear Tickets:
1. Ve a la página principal (`/`)
2. Haz clic en "Escanear QR"
3. Apunta la cámara al código QR del ticket
4. El sistema verificará automáticamente el ticket

### Para Administrar Tickets:
1. Ve a la página de administración (`/admin`)
2. Ve todos los tickets en la tabla
3. Usa los botones de acción para cada ticket:
   - **Ver**: Muestra la invitación completa
   - **WhatsApp**: Abre WhatsApp con el mensaje predefinido
   - **Eliminar**: Borra el ticket (con confirmación)

## 🔧 Configuración

El servicio de tickets está configurado para usar la URL base:
```javascript
const BASE_URL = 'https://tikets-halloween-7g5s.vercel.app';
```

Puedes cambiar esta URL en `src/services/ticketService.js` si necesitas apuntar a un servidor diferente.

## 📄 Licencia

© 2024 Sistema de Tickets Halloween - Desarrollado con React

---

¡Disfruta tu fiesta de Halloween! 🎃👻🎉