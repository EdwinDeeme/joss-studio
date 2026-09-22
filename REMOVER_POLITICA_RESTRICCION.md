# 🔓 Cómo remover la política de restricción de claves

## Primero: Identifica tu tipo de cuenta

### ¿Cuál es tu situación?

**CASO 1: Cuenta PERSONAL de Google (Gmail)**
- Email: `tunombre@gmail.com` o similar
- Creada por ti, no por una empresa
- → Ve a la sección "CASO 1" abajo

**CASO 2: Cuenta WORKSPACE (Empresa)**
- Email: `tunombre@empresa.com`
- Creada/administrada por tu empresa
- → Ve a la sección "CASO 2" abajo

**CASO 3: Cuenta PERSONAL pero con restricciones**
- Tienes restricciones aún siendo personal
- → Ve a la sección "CASO 3" abajo

---

## CASO 1: Cuenta PERSONAL de Gmail

### Verifica primero que sea personal

1. Ve a https://console.cloud.google.com
2. Arriba a la derecha, mira tu email
3. Si es `@gmail.com`, `@googlemail.com`, o similar → es personal

### Quitar la restricción

**Opción A: Desde Políticas de Recursos**

1. Ve a: https://console.cloud.google.com/iam-admin/org-policies
2. Busca: `iam.disableServiceAccountKeyCreation`
3. Si aparece:
   - Haz clic en ella
   - Busca botón "Eliminar Política" (Delete Policy)
   - Confirma
4. Si NO aparece → continúa con Opción B

**Opción B: Verificar Configuración de Organización**

1. Ve a: https://console.cloud.google.com/iam-admin/settings
2. Busca "Políticas de la Organización"
3. Busca `iam.disableServiceAccountKeyCreation`
4. Si está ACTIVADA (azul):
   - Haz clic en el toggle
   - Selecciona "Desactivar"
   - Guardar

**Opción C: Crear nuevo proyecto SIN restricciones**

Si las opciones anteriores no funcionan:

1. Ve a https://console.cloud.google.com
2. Arriba a la izquierda, haz clic en "Seleccionar un proyecto"
3. Haz clic en "NUEVO PROYECTO"
4. Nombre: "Joss Studio Personal"
5. Crear
6. Espera 30 segundos
7. En este proyecto NUEVO, intenta crear la Service Account
   - Es probable que NO tenga restricciones

---

## CASO 2: Cuenta WORKSPACE (Empresa)

Si tu email es `@empresa.com`, la política la puso tu administrador de Google Workspace.

### Opción A: Contacta al Admin (RECOMENDADO)

Envía este mensaje a tu admin de Workspace:

> "Hola, necesito crear una clave de Service Account para integración con Google Calendar en un proyecto personal. Parece que está bloqueada la política `iam.disableServiceAccountKeyCreation`. ¿Puedes desactivarla o ayudarme a crear la clave?"

### Opción B: Usa tu cuenta PERSONAL en paralelo

Si quieres evitar contactar al admin:

1. Ve a https://myaccount.google.com
2. Crea una cuenta de Gmail PERSONAL (si no tienes)
3. Usa ESA cuenta personal para Google Cloud
4. En ESA cuenta personal:
   - Crea el proyecto "Joss Studio"
   - Crea la Service Account
   - Descarga la clave JSON
5. Usa esas credenciales en tu proyectolocal

**Ventaja:** No necesitas permiso de nadie  
**Desventaja:** La clave es de tu cuenta personal

---

## CASO 3: Cuenta Personal con restricciones raras

Si es `@gmail.com` pero AÚN tienes restricciones:

### Paso 1: Verifica la organización

1. Ve a: https://console.cloud.google.com/iam-admin/settings
2. Busca "Organización"
3. ¿Dice "No hay organización"?
   - Si SÍ → las restricciones podrían estar en Google Workspace
   - Si NO → tienes una organización asociada

### Paso 2: Si tienes Organización

1. Ve a: https://console.cloud.google.com/iam-admin/org-policies
2. Busca `iam.disableServiceAccountKeyCreation`
3. Haz clic
4. Busca "Editar política"
5. Cambia estado a "No aplicado" (Unenforced)
6. Guardar

### Paso 3: Si nada funciona

Crea un proyecto NUEVO desde cero:

1. https://console.cloud.google.com
2. Arriba, "Seleccionar proyecto" → "NUEVO PROYECTO"
3. Nombre único: "joss-studio-personal-2024"
4. Crear
5. Intenta crear Service Account en ESTE proyecto nuevo
6. Si funciona → úsalo. Si no funciona → es restricción de Google Workspace

---

## ✅ Checklist de diagnóstico

Usa este checklist para identificar exactamente tu caso:

```
¿Tu email en Google Cloud Console es @gmail.com o similar (PERSONAL)?
[ ] Sí → CASO 1
[ ] No, es @empresa.com → CASO 2

¿Ves "Políticas de Recursos" en IAM?
[ ] Sí → Intenta remover desde ahí
[ ] No → Crea un proyecto NUEVO

¿Encontraste iam.disableServiceAccountKeyCreation?
[ ] Sí → Desactívala/Elimínala
[ ] No → Es probable que sea restricción de Workspace (contacta admin)

¿Ahora puedes crear claves?
[ ] Sí → ¡Listo! Descarga el JSON y continúa
[ ] No → Crea proyecto nuevo o usa cuenta personal diferente
```

---

## 📋 Próximos pasos una vez remuevas la restricción

1. Crea la Service Account (Paso 3 de GOOGLE_CALENDAR_SETUP.md)
2. Descarga el JSON con la clave
3. Copia valores a `.env`
4. Ejecuta `bash verify-config.sh`
5. Inicia servidor: `npm run dev -- --port 3000`

---

## ¿Aún atascado?

Si nada de esto funciona:

1. Comparte screenshot de: https://console.cloud.google.com/iam-admin/org-policies
2. Dime qué email ves arriba en Google Cloud Console
3. Dime si en "Settings" dice "Organización" o "No hay organización"

Con esa info puedo darte solución exacta.
