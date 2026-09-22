# Guía Rápida: Integración Google Calendar

## ¿Qué se implementó?

✅ Cuando un cliente reserva en la página → aparece automáticamente en tu Google Calendar  
✅ La página ve tu Google Calendar → muestra solo horarios libres  
✅ Todo completamente automático y transparente para el cliente  

## Configuración en Google Cloud (5 minutos)

### Paso 1: Crear Google Cloud Project
- Ve a https://console.cloud.google.com
- Haz clic en "Crear Proyecto"
- Nombre: "Joss Studio" → Crear

### Paso 2: Habilitar Google Calendar API
- Busca "Google Calendar API"
- Haz clic en "Habilitar"

### Paso 3: Crear Service Account
- Ve a "Credenciales" en el menú izquierdo
- "Crear Credenciales" → "Cuenta de servicio"
- Nombre: "joss-studio-calendar"
- Crear → Continuar (sin cambios) → Crear clave

### Paso 4: Descargar credenciales
- Cuando pida clave, selecciona "JSON" → Crear
- **Se descargará un archivo** - ábrelo y copia TODOS estos valores:
  - `private_key_id`
  - `private_key` (completo con BEGIN/END)
  - `client_email`
  - `project_id`
  - `client_id`

### Paso 5: Guardar en `.env.local`
En la raíz del proyecto, copia esto y reemplaza con tus valores:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=joss-studio-calendar@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=tu-proyecto
GOOGLE_CALENDAR_ID=abc123@group.calendar.google.com
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/joss_studio
```

**⚠️ Importante:** El `GOOGLE_PRIVATE_KEY` debe estar entre comillas y con `\n` en lugar de saltos de línea.

### Paso 6: Obtener Google Calendar ID
- Ve a https://calendar.google.com
- Haz clic en tu calendario (la que usarás)
- Click en los 3 puntos → "Configuración"
- Ve a "Integrar calendario"
- Copia el **ID del calendario** (ejemplo: `abc123@group.calendar.google.com`)

### Paso 7: Dar acceso a la Service Account
- En Google Calendar, mismo lugar ("Configuración")
- Ve a "Compartir con otras personas"
- Agrega el email de la Service Account:
  ```
  joss-studio-calendar@tu-proyecto.iam.gserviceaccount.com
  ```
- Dale permiso "Editor"
- Guardar

## ¿Qué pasa ahora?

1. **Cliente reserva en la página** → selecciona servicio, fecha, hora, completa datos
2. **Automáticamente:**
   - Se crea evento en tu Google Calendar
   - Se guarda en la base de datos
   - La página muestra "✓ Reserva confirmada"
3. **En el calendario:**
   - Ves el evento con detalles: cliente, teléfono, servicio, precio
   - Aparece automáticamente (4:45 AM Costa Rica = UTC-6)

## Pruebas en localhost:3000

- El servidor ya está corriendo en http://localhost:3000
- Intenta hacer una reserva (cualquier dato funciona, es test)
- Revisa tu Google Calendar - debería aparecer nuevo evento

## Variables de entorno configuradas

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` ← Email de la cuenta de servicio
- `GOOGLE_PRIVATE_KEY` ← Clave privada (con formato `\n`)
- `GOOGLE_PROJECT_ID` ← ID del proyecto
- `GOOGLE_CALENDAR_ID` ← ID del calendario público

## Archivo de documentación completa

Para más detalles: Ver `GOOGLE_CALENDAR_SETUP.md`

## Troubleshooting

**"Could not create Google Calendar event"**
- Verifica que todos los `.env` valores están correctos
- Verifica que la Service Account tiene acceso al calendario (Paso 7)

**"GOOGLE_CALENDAR_ID not configured in .env"**
- Falta copiar la variable a `.env.local`
- El ID debe ser algo como: `abc123@group.calendar.google.com`

**Horarios no apajecen**
- Verifica que Google Calendar API está habilitado
- Espera 1-2 minutos después de habilitar

¡Listo! La integración está completa y lista para usar.
