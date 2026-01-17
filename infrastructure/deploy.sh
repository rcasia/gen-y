#!/bin/bash
set -e

# Script de despliegue alternativo usando Railway CLI
# Útil si Terraform no está disponible o tiene problemas

echo "🚀 Desplegando GenY Market en Railway..."

# Verificar que Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado"
    echo "📦 Instalando Railway CLI..."
    npm i -g @railway/cli
fi

# Verificar login
if ! railway whoami &> /dev/null; then
    echo "🔐 Iniciando sesión en Railway..."
    railway login
fi

# Inicializar proyecto si no existe
if [ ! -f .railway/project.json ]; then
    echo "📁 Inicializando proyecto Railway..."
    railway init
fi

# Configurar variables de entorno
echo "⚙️  Configurando variables de entorno..."
railway variables set NODE_ENV=production
railway variables set PORT=80

# Desplegar
echo "🚢 Desplegando aplicación..."
railway up

echo ""
echo "✅ Despliegue completado!"
echo "📊 Estado del servicio:"
railway status

echo ""
echo "🌐 URL del servicio:"
railway domain
