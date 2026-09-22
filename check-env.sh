#!/bin/bash

echo "=== Verificando configuración de Google Calendar ==="
echo ""

if [ -z "$GOOGLE_SERVICE_ACCOUNT_EMAIL" ]; then
    echo "❌ GOOGLE_SERVICE_ACCOUNT_EMAIL no está configurado"
else
    echo "✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: $GOOGLE_SERVICE_ACCOUNT_EMAIL"
fi

if [ -z "$GOOGLE_PRIVATE_KEY" ]; then
    echo "❌ GOOGLE_PRIVATE_KEY no está configurado"
else
    echo "✅ GOOGLE_PRIVATE_KEY: (configurado)"
fi

if [ -z "$GOOGLE_PROJECT_ID" ]; then
    echo "❌ GOOGLE_PROJECT_ID no está configurado"
else
    echo "✅ GOOGLE_PROJECT_ID: $GOOGLE_PROJECT_ID"
fi

if [ -z "$GOOGLE_CALENDAR_ID" ]; then
    echo "❌ GOOGLE_CALENDAR_ID no está configurado"
else
    echo "✅ GOOGLE_CALENDAR_ID: $GOOGLE_CALENDAR_ID"
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL no está configurado"
else
    echo "✅ DATABASE_URL: (configurado)"
fi

echo ""
echo "Para completar la configuración, sigue estos pasos:"
echo "1. Ve a GOOGLE_CALENDAR_SETUP.md en la raíz del proyecto"
echo "2. Sigue las instrucciones paso a paso"
echo "3. Copia los valores a .env.local"
echo "4. Ejecuta: npm run dev -- --port 3000"
