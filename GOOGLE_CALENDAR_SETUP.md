# Google Calendar - Integración Automática

Sistema que sincroniza reservas automáticamente con tu Google Calendar. Cuando un cliente reserva, aparece en tu calendario. La página ve tu disponibilidad en tiempo real.

## Configuración (5 minutos)

### 1. Crear Google Cloud Project

Ve a [Google Cloud Console](https://console.cloud.google.com)

- Haz clic en "Crear Proyecto"
- Nombre: "Joss Studio"
- Haz clic en "Crear"

### 2. Habilitar Google Calendar API

- En la búsqueda de arriba, escribe "Calendar"
- Selecciona "Google Calendar API" 
- Haz clic en "Habilitar"

### 3. Crear Service Account

- Ve a [Credenciales](https://console.cloud.google.com/apis/credentials)
- Haz clic en "Crear Credenciales" → "Cuenta de servicio"
- Nombre: "joss-studio-calendar"
- Haz clic en "Crear"
- En la siguiente pantalla, haz clic en "Continuar" (sin cambios)
- Haz clic en "Crear clave"
- Selecciona "JSON" → "Crear"
- **Se descargará un archivo JSON** - GUÁRDALO EN LUGAR SEGURO

### 4. Obtener credenciales del JSON

Abre el JSON que descargaste. Verás:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "joss-studio-calendar@....iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 5. Guardar en `.env`

En la raíz del proyecto, edita `.env.local` y agrega:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=joss-studio-calendar@....iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=tu-project-id
GOOGLE_CALENDAR_ID=tu-calendar-id@group.calendar.google.com
```

**Obtener GOOGLE_CALENDAR_ID:**
- Ve a [Google Calendar](https://calendar.google.com)
- Haz clic derecho en tu calendario → "Configuración"
- Ve a "Integrar calendario"
- Copia el "ID del calendario" (será como: `abc123@group.calendar.google.com`)

### 6. Dar acceso a la Service Account

- Abre tu Google Calendar
- Haz clic en los 3 puntos del calendario que quieres usar → "Compartir"
- En "Compartir con otras personas", agrega el email de la Service Account:
  ```
  joss-studio-calendar@tu-proyecto.iam.gserviceaccount.com
  ```
- Dale permiso "Editor"

### 7. Listo!

Ahora cuando los clientes reserven:
- ✅ Automáticamente aparece en tu Google Calendar
- ✅ La página ve cuándo estás ocupada
- ✅ Solo muestra horarios libres

## Cómo funciona en la página

1. Cliente selecciona fecha → página lee Google Calendar
2. Muestra solo slots libres (excluye eventos existentes)
3. Cliente selecciona hora y completa reserva
4. Se crea evento automáticamente en Google Calendar + se guarda en base de datos
5. El evento incluye: nombre del cliente, teléfono, servicio, precio, referencia de pago

Eso es todo - completamente automático!

  - `http://localhost:3000/api/auth/callback/google` (callback)
  - La URL de producción cuando despliegues
- Descarga el JSON con las credenciales

### 4. Configurar variables de entorno

Abre el archivo JSON descargado y copia estos valores a tu `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<client_id>
GOOGLE_CLIENT_SECRET=<client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

### 5. El usuario se autentica

Cuando el usuario hace una reserva:
1. Se le pedirá que inicie sesión con Google
2. Google le mostrará un permiso para acceder a su calendario
3. Una vez autorizado, automáticamente se crean eventos en su Google Calendar

**No hay tarjetas, no hay credenciales complicadas - solo click en "Autorizar con Google"**

## Características

✅ Autenticación simple con Google OAuth 2.0
✅ Los eventos se crean en el calendario del usuario autenticado
✅ Información del cliente, costo y detalles del servicio
✅ Recordatorios automáticos en Google Calendar
✅ Sin credenciales sensibles en el servidor

## ¿Cómo funciona?

1. Usuario hace una reserva
2. Se abre pop-up: "Autoriza a Joss Studio para acceder a tu Google Calendar"
3. Usuario hace clic en "Permitir"
4. Google redirige de vuelta a la app con un token
5. El evento se crea automáticamente en su calendario

Eso es todo. Simple, seguro y sin fricción.

## Troubleshooting

Si no funciona:
1. Verifica que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` está en `.env.local`
2. Verifica que `GOOGLE_CLIENT_SECRET` está en `.env.local` (solo servidor)
3. Verifica que el URI de redirección coincide en Google Cloud Console
4. Revisa la consola del navegador para errores de autenticación


