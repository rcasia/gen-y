#!/bin/bash

# Script para construir y probar la imagen Docker localmente

echo "🔨 Construyendo imagen Docker..."
docker build -t geny-market:latest .

echo "✅ Imagen construida exitosamente"
echo ""
echo "Para ejecutar localmente:"
echo "  docker run -p 3000:80 geny-market:latest"
echo ""
echo "O usando docker-compose:"
echo "  docker-compose -f infrastructure/docker-compose.yml up"
