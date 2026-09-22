# 📝 Guía Rápida: Después de remover la restricción

## Ya removiste la política ✅

Ahora sigue estos pasos para completar la configuración:

## 1. Descarga el JSON con la clave

- Ve a https://console.cloud.google.com/iam-admin/serviceaccounts
- Busca tu Service Account: `joss-studio-calendar@...`
- Haz clic en ella
- Ve a la pestaña **"CLAVES"**
- Haz clic en **"CREAR CLAVE"**
- Selecciona **"JSON"**
- Haz clic en **"CREAR"**
- **Se descargará automáticamente** el archivo JSON

## 2. Abre el archivo JSON

El archivo se llama algo como:
```
project-xxxxx-xxxxx.json
```

Ábrelo con un editor de texto (Bloc de notas, VSCode, etc.)

## 3. Extrae estos 4 valores

**En el JSON, busca y copia:**

### A) GOOGLE_SERVICE_ACCOUNT_EMAIL
Busca la línea: `"client_email"`
Copia el valor (sin comillas)

Ejemplo:
```
joss-studio-calendar@project-65db65a4-xxx.iam.gserviceaccount.com
```

### B) GOOGLE_PRIVATE_KEY
Busca la línea: `"private_key"`
Copia TODO lo que esté entre las comillas (incluyendo `\n`)

Ejemplo:
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQE...
-----END PRIVATE KEY-----
```

### C) GOOGLE_PROJECT_ID
Busca la línea: `"project_id"`
Copia el valor (sin comillas)

Ejemplo:
```
104353198625156934968
```

### D) GOOGLE_CALENDAR_ID
Ve a https://calendar.google.com
- Haz clic en tu calendario
- Haz clic en 3 puntos "⋮" → **"Configuración"**
- En "Integrar calendario", busca **"ID del calendario"**
- Copia ese ID

Ejemplo:
```
abc123def456@group.calendar.google.com
```

## 4. Actualiza tu `.env`

En la raíz de tu proyecto, edita el archivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/joss_studio"

# Google Calendar - Service Account Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL="PEGA_AQUI_EL_EMAIL"
GOOGLE_PRIVATE_KEY="PEGA_AQUI_LA_CLAVE_COMPLETA"
GOOGLE_PROJECT_ID="PEGA_AQUI_EL_PROJECT_ID"
GOOGLE_CALENDAR_ID="PEGA_AQUI_EL_CALENDAR_ID"
```

**Ejemplo final:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/joss_studio"

GOOGLE_SERVICE_ACCOUNT_EMAIL="joss-studio-calendar@project-65db65a4-xxx.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID="104353198625156934968"
GOOGLE_CALENDAR_ID="abc123def456@group.calendar.google.com"
```

## 5. Verifica la configuración

Ejecuta este comando en la terminal:

```bash
bash verify-config.sh
```

Debería mostrar ✓ para todas las variables.

## 6. Inicia el servidor

```bash
npm run dev -- --port 3000
```

Abre http://localhost:3000

## 7. Prueba una reserva

- Selecciona servicio, fecha, hora
- Completa datos del cliente
- Haz clic en confirmar
- **Verifica que aparezca en Google Calendar** en tiempo real

---

## ✅ Checklist

- [ ] Removí la restricción `iam.disableServiceAccountKeyCreation`
- [ ] Descargué el archivo JSON
- [ ] Extraje los 4 valores del JSON
- [ ] Actualicé `.env` con los valores
- [ ] Ejecuté `bash verify-config.sh` - todo ✓
- [ ] Inicié servidor: `npm run dev -- --port 3000`
- [ ] Probé una reserva y apareció en Google Calendar

¡Listo! 🎉
