# Google Calendar - Integración OAuth 2.0 (Sin claves de Service Account)

## ¿Por qué OAuth y no Service Account?

Tu organización tiene una **política de seguridad** que impide crear claves de Service Account (`iam.disableServiceAccountKeyCreation`).

**OAuth 2.0 es la solución:** No necesita claves, solo autorización del usuario.

---

## Configuración (10 minutos)

### Paso 1: Crear Google Cloud Project

Ve a https://console.cloud.google.com

- Haz clic en "Seleccionar un proyecto" → "Nuevo proyecto"
- Nombre: **"Joss Studio"**
- Crear

### Paso 2: Habilitar Google Calendar API

- Busca "Google Calendar API"
- Haz clic en "Habilitar"

### Paso 3: Crear credenciales OAuth 2.0

- Ve a "APIs y Servicios" → "Credenciales"
- Haz clic en "Crear credenciales" → "ID de cliente de OAuth"
- Se te pedirá: "Primero configura la pantalla de consentimiento"

### Paso 4: Configurar pantalla de consentimiento

- Haz clic en "Configurar pantalla de consentimiento"
- **Tipo de usuario:** "Externo"
- Haz clic en "Crear"
- Rellena:
  - **Nombre de la app:** "Joss Studio"
  - **Email de soporte:** tu email
  - Haz clic en "Guardar y continuar"
- En "Scopes", haz clic en "Agregar o quitar scopes"
  - Busca: **"calendar"**
  - Selecciona:
    - `../auth/calendar` (Crear/editar eventos)
    - `../auth/calendar.readonly` (Ver disponibilidad)
  - Haz clic en "Actualizar"
- Haz clic en "Guardar y continuar"
- En "Usuarios de prueba" → "Agregar usuarios"
  - Agrega tu email de Google
  - Guardar

### Paso 5: Crear ID de cliente OAuth

- Ve a "Credenciales" de nuevo
- Haz clic en "Crear credenciales" → "ID de cliente de OAuth"
- **Tipo de aplicación:** "Aplicación web"
- **Nombre:** "Joss Studio"
- **URIs autorizados:**
  - `http://localhost:3000`
  - `http://localhost:3000/api/auth/google/callback`
- **Orígenes JavaScript autorizados:**
  - `http://localhost:3000`
- Haz clic en "Crear"

### Paso 6: Descarga y guarda las credenciales

Se abrirá un cuadro con:
- **ID de cliente:** Copia esto
- **Secreto de cliente:** Copia esto

O descarga como JSON (haz clic en descargar)

### Paso 7: Configura `.env.local`

En la raíz de tu proyecto, edita `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/joss_studio"

# Google OAuth 2.0 - SIN claves de Service Account
NEXT_PUBLIC_GOOGLE_CLIENT_ID="tu-id-de-cliente.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-secreto-de-cliente"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Reemplaza:
- `tu-id-de-cliente.apps.googleusercontent.com` con tu ID de cliente
- `tu-secreto-de-cliente` con tu secreto

---

## ¿Cómo funciona?

1. **Cliente abre la página de reserva** → ve botón "Sincronizar con Google Calendar"
2. **Haz clic** → se abre ventana de Google
3. **Autoriza** → Google te pide permiso una sola vez
4. **Listo** → Ya puedes:
   - Ver tu disponibilidad en tiempo real
   - Los eventos se crean automáticamente en tu calendario

---

## Ventajas de OAuth

✅ **No necesita claves** - Compatible con políticas de seguridad corporativa  
✅ **Seguro** - Las contraseñas nunca se envían al servidor  
✅ **Autorización del usuario** - Tú controlas qué permisos da  
✅ **Fácil de usar** - Solo un clic de autorización  

---

## Prueba en localhost

```bash
npm run dev -- --port 3000
```

Abre http://localhost:3000 y deberías ver un botón "Vincular Google Calendar"

---

## Para producción

Cuando despliegues:

1. Crea un proyecto OAuth nuevo en Google Cloud (para producción)
2. Agrega tu dominio de producción:
   - **URIs autorizados:** `https://tusitio.com`
   - **Orígenes JavaScript:** `https://tusitio.com`
3. Actualiza `.env.local` con las credenciales de producción
4. Redeploy

---

## Troubleshooting

**"Invalid client_id"**
- Verifica que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` es correcto
- Verifica que está en `.env.local` (no `.env`)

**"Callback URL mismatch"**
- Verifica que la URL de callback en Google Cloud es:
  - Exacta: `http://localhost:3000/api/auth/google/callback`
- Verifica que `NEXT_PUBLIC_APP_URL` es `http://localhost:3000`

**"Read-only calendar"**
- En la pantalla de consentimiento, asegúrate de habilitar:
  - `../auth/calendar` (permisos de escritura)

¡Listo! OAuth sin complicaciones 🎉
