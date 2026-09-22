# 🗺️ Cómo llegar a Políticas de Recursos (paso a paso visual)

## Si estás en "Permisos" y quieres ir a "Políticas de Recursos"

### Opción 1: Usar la URL directa (MÁS RÁPIDO)

1. Copia esta URL exacta:
```
https://console.cloud.google.com/iam-admin/org-policies
```

2. Pégala en la barra de direcciones del navegador

3. Presiona Enter

**Te lleva directamente a Políticas de Recursos** ✅

---

### Opción 2: Desde el menú izquierdo (si prefieres navegar)

**Paso 1: Ubícate en el menú izquierdo**

Deberías ver algo como esto:
```
┌─────────────────────────────┐
│ ☰ Menú                       │
├─────────────────────────────┤
│ Inicio                       │
│ APIs y Servicios             │
│   ├ Bibliotecas             │
│   ├ Credenciales ← (aquí está) │
│   └ Claves de API           │
│ IAM y administración         │
│   ├ IAM ← (estás aquí probablemente) │
│   ├ Permisos ← (aquí estás ahora)    │
│   ├ Políticas de la Org. ← (AQUÍ!)   │
│   ├ Configuración           │
│   └ Auditoría               │
└─────────────────────────────┘
```

**Paso 2: Busca en el menú izquierdo**

- Mira la sección **"IAM y administración"**
- Dentro de ahí, haz scroll hacia abajo
- Busca **"Políticas de la Organización"** o **"Org Policies"**

**Paso 3: Haz clic en "Políticas de la Organización"**

---

### Opción 3: Si no ves "Políticas de la Organización" en el menú

Es posible que tu organización no tenga políticas visibles. En ese caso:

1. Ve directamente a la URL:
```
https://console.cloud.google.com/iam-admin/org-policies
```

2. Si la página dice:
   - **"No hay organización"** → La política podría estar en otro lugar
   - **"Crear política"** → Haz clic y busca `iam.disableServiceAccountKeyCreation`
   - **Ve la política listada** → Haz clic en ella

---

## Una vez estés en "Políticas de Recursos"

### Deberías ver algo como:

```
╔═══════════════════════════════════════════╗
║ Políticas de la Organización              ║
╠═══════════════════════════════════════════╣
║                                           ║
║ 🔍 Buscar políticas...                    ║
║                                           ║
║ iam.disableServiceAccountKeyCreation      ║
║ iam.disableServiceAccountCreation         ║
║ iam.restrictSharedVpcs                    ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### Busca tu política:

1. En la barra de búsqueda, escribe:
```
iam.disableServiceAccountKeyCreation
```

2. Si aparece en los resultados:
   - Haz clic en ella
   - Verás opciones: **EDITAR**, **ELIMINAR**, o similar
   - Selecciona **ELIMINAR** o **DESACTIVAR**
   - Confirma

### Si NO aparece en los resultados:

Significa que la política no está aplicada a tu proyecto personal. En ese caso:

1. Haz clic en el botón **"CREAR POLÍTICA"**
2. Busca `iam.disableServiceAccountKeyCreation`
3. Si aparece, significa que ESTÁ disponible para aplicarse (pero no está activa ahora)
4. Si NO aparece, NO hay restricción 🎉

---

## Resumen: Los 3 casos posibles

| Caso | Qué ves | Qué hacer |
|------|---------|-----------|
| **Caso 1: Ves la política activa** | `iam.disableServiceAccountKeyCreation` en la lista | Haz clic → ELIMINAR o DESACTIVAR |
| **Caso 2: NO ves la política** | La lista está vacía o no aparece | NO hay restricción, continúa con crear claves |
| **Caso 3: Ve "Crear política"** | Solo ves botón, sin restricciones listadas | NO hay restricción activa, haz clic en crear claves |

---

## ¿Cuál es tu caso?

Cuando abras https://console.cloud.google.com/iam-admin/org-policies

**¿Qué ves exactamente?**

1. ¿Aparece `iam.disableServiceAccountKeyCreation` en una lista?
2. ¿O dice "No hay organizaciones" o similar?
3. ¿O solo ves un botón "Crear política"?

Dime número (1, 2, o 3) y el siguiente paso es obvio 👇
