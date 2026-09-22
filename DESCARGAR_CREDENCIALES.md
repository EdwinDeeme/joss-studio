# ⬇️ Cómo descargar el archivo JSON de credenciales

## Paso 1: Abre Google Cloud Console
👉 https://console.cloud.google.com

## Paso 2: Selecciona tu proyecto
- Arriba a la izquierda donde dice el nombre del proyecto
- Busca y selecciona **"Joss Studio"**

## Paso 3: Ve a Cuentas de Servicio
En el menú izquierdo:
1. Haz clic en "APIs y Servicios"
2. Luego en "Cuentas de servicio"

## Paso 4: Encuentra tu Service Account
Busca el email: `joss-studio-calendar@project-...iam.gserviceaccount.com`
- Haz clic en él

## Paso 5: Ve a la pestaña "Claves"
Arriba verás varias pestañas. Haz clic en **"Claves"**

## Paso 6: CREA una clave nueva ⚠️
Si no hay ninguna clave, debes crearla:
1. Haz clic en el botón **"Crear clave"** o **"Add Key"**
2. Se abrirá un menú - selecciona **"JSON"**
3. Haz clic en **"Crear"**

## Paso 7: Se descargará automáticamente
Un archivo JSON se bajará a tu carpeta "Descargas". El nombre será algo como:
```
project-65db65a4-734a-467a-b64-xxxxxxxxxxxx.json
```

## Paso 8: Abre el archivo en VSCode
- Arrastra el archivo a VSCode
- O haz clic derecho → "Abrir con" → VSCode

## Paso 9: Extrae el valor `private_key`
Dentro del archivo verás:
```json
{
  "type": "service_account",
  "project_id": "104353198625156934968",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----\n",
  "client_email": "joss-studio-calendar@...",
  ...
}
```

**Busca la línea `"private_key"` y copia TODO lo que esté entre las comillas**

Debe empezar con: `-----BEGIN PRIVATE KEY-----`
Y terminar con: `-----END PRIVATE KEY-----\n`

## Paso 10: Pega en `.env`

En el archivo `.env` de tu proyecto, reemplaza:
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOPIA_EL_VALOR_DEL_ARCHIVO_JSON\n-----END PRIVATE KEY-----\n"
```

Con el valor completo que copiaste del JSON.

**Ejemplo de cómo debería verse:**
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...[muchos caracteres aquí]...\n-----END PRIVATE KEY-----\n"
```

---

## ✅ Tu `.env` completo debería verse así:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/joss_studio"

# Google Calendar - Service Account Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL="joss-studio-calendar@project-65db65a4-734a-467a-b64.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID="104353198625156934968"
GOOGLE_CALENDAR_ID="tu-calendario-id@group.calendar.google.com"
```

## Paso 11: Reinicia el servidor

Una vez hayas pegado el `GOOGLE_PRIVATE_KEY`, guarda el archivo y ejecuta:

```bash
npm run dev -- --port 3000
```

¡Listo! 🎉
