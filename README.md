# Joss Studio Booking MVP

Aplicación de reservas para una manicurista con foco en velocidad de carga, flujo mobile-first y validación manual del depósito antes de confirmar la cita.

## Stack

- Astro 5 con SSR en Node
- Prisma con PostgreSQL
- Google Calendar API para crear el evento al confirmar
- JavaScript mínimo en cliente para mantener la interfaz rápida en celular

## Flujo de reserva

1. La clienta selecciona servicio, fecha y hora disponible.
2. Ingresa sus datos, el número de comprobante SINPE y opcionalmente una foto de inspiración.
3. La reserva se guarda como `PENDING_VALIDATION` y el horario queda bloqueado.
4. Desde `/admin?token=...` la manicurista valida el depósito.
5. Al confirmar, se crea el evento en Google Calendar y la cita pasa a `CONFIRMED`.

## Variables de entorno

Crea un archivo `.env` usando `.env.example`.

- `DATABASE_URL`: cadena de conexión PostgreSQL.
- `ADMIN_TOKEN`: token simple para acceder al panel administrativo del MVP.
- `PUBLIC_SITE_URL`: URL base pública, usada para construir el enlace de la foto de inspiración.
- `GOOGLE_CALENDAR_ID`: calendario destino.
- `GOOGLE_CLIENT_EMAIL`: correo de la service account.
- `GOOGLE_PRIVATE_KEY`: llave privada de la service account, respetando saltos de línea con `\n`.

## Comandos

- `npm install`
- `npm run db:generate`
- `npm run db:push`
- `npm run dev`
- `npm run build`
- `npm run check`

## Google Calendar

La integración usa una service account de Google. Debes compartir el calendario de la clienta con el correo de esa service account y darle permisos para editar eventos.

## Panel admin

Ruta: `/admin?token=TU_TOKEN`

En este MVP, el token viaja por query string para mantener el panel simple. Antes de producción conviene reemplazar esto por autenticación real.

## Estado actual

Este proyecto ya incluye:

- formulario mobile-first de reserva
- consulta de disponibilidad por fecha y servicio
- persistencia de reservas en PostgreSQL
- bloqueo de espacios pendientes y confirmados
- carga de imagen de inspiración a `public/uploads/inspirations`
- panel básico de validación y confirmación
- creación del evento en Google Calendar al confirmar
