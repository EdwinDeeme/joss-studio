#!/bin/bash

echo "🔍 Verificando configuración de Google Calendar"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador
MISSING=0

# Verificar GOOGLE_SERVICE_ACCOUNT_EMAIL
if grep -q '^GOOGLE_SERVICE_ACCOUNT_EMAIL=' .env; then
    EMAIL=$(grep '^GOOGLE_SERVICE_ACCOUNT_EMAIL=' .env | cut -d'=' -f2 | tr -d '"')
    if [[ "$EMAIL" != *"@"* ]] || [[ "$EMAIL" == *"project-"* ]]; then
        echo -e "${GREEN}✓${NC} GOOGLE_SERVICE_ACCOUNT_EMAIL configurado"
    else
        echo -e "${RED}✗${NC} GOOGLE_SERVICE_ACCOUNT_EMAIL parece no ser válido"
        ((MISSING++))
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_SERVICE_ACCOUNT_EMAIL no encontrado"
    ((MISSING++))
fi

# Verificar GOOGLE_PRIVATE_KEY
if grep -q '^GOOGLE_PRIVATE_KEY=' .env; then
    KEY=$(grep '^GOOGLE_PRIVATE_KEY=' .env)
    if [[ "$KEY" == *"BEGIN PRIVATE KEY"* ]] && [[ "$KEY" != *"COPIA_EL_VALOR"* ]]; then
        echo -e "${GREEN}✓${NC} GOOGLE_PRIVATE_KEY configurado"
    else
        echo -e "${YELLOW}⚠${NC} GOOGLE_PRIVATE_KEY no parece estar configurado correctamente"
        ((MISSING++))
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_PRIVATE_KEY no encontrado"
    ((MISSING++))
fi

# Verificar GOOGLE_PROJECT_ID
if grep -q '^GOOGLE_PROJECT_ID=' .env; then
    PROJECT=$(grep '^GOOGLE_PROJECT_ID=' .env | cut -d'=' -f2 | tr -d '"')
    if [[ "$PROJECT" != "" ]] && [[ "$PROJECT" != "tu-project-id" ]]; then
        echo -e "${GREEN}✓${NC} GOOGLE_PROJECT_ID configurado"
    else
        echo -e "${YELLOW}⚠${NC} GOOGLE_PROJECT_ID no parece estar configurado"
        ((MISSING++))
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_PROJECT_ID no encontrado"
    ((MISSING++))
fi

# Verificar GOOGLE_CALENDAR_ID
if grep -q '^GOOGLE_CALENDAR_ID=' .env; then
    CALENDAR=$(grep '^GOOGLE_CALENDAR_ID=' .env | cut -d'=' -f2 | tr -d '"')
    if [[ "$CALENDAR" == *"@group.calendar.google.com"* ]] && [[ "$CALENDAR" != "abc123"* ]]; then
        echo -e "${GREEN}✓${NC} GOOGLE_CALENDAR_ID configurado"
    else
        echo -e "${YELLOW}⚠${NC} GOOGLE_CALENDAR_ID no parece ser válido"
        ((MISSING++))
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_CALENDAR_ID no encontrado"
    ((MISSING++))
fi

echo ""
echo "================================================"

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ Configuración lista - puedes iniciar el servidor${NC}"
    echo ""
    echo "Inicia el servidor con:"
    echo "  npm run dev -- --port 3000"
    exit 0
else
    echo -e "${RED}❌ Faltan $MISSING configuraciones${NC}"
    echo ""
    echo "Sigue estos pasos:"
    echo "1. Ve a Google Cloud Console: https://console.cloud.google.com"
    echo "2. Crea/selecciona proyecto 'Joss Studio'"
    echo "3. Habilita Google Calendar API"
    echo "4. Crea Service Account y descarga JSON con la clave"
    echo "5. Copia los valores de .env.example y rellena con datos del JSON"
    echo ""
    echo "Para más detalles, ve GOOGLE_CALENDAR_SETUP.md"
    exit 1
fi
