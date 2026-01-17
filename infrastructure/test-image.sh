#!/bin/bash
set -e

# Script para testear que la imagen Docker funciona correctamente
# Uso: ./infrastructure/test-image.sh [nombre-imagen]

IMAGE_NAME=${1:-geny-market:latest}
CONTAINER_NAME="geny-test-$(date +%s)"
TEST_PORT=8080

echo "🧪 Testeando imagen: $IMAGE_NAME"
echo "📦 Nombre del contenedor: $CONTAINER_NAME"
echo ""

# Limpiar contenedores anteriores si existen
echo "🧹 Limpiando contenedores anteriores..."
docker ps -a | grep "geny-test-" | awk '{print $1}' | xargs -r docker rm -f 2>/dev/null || true

# Iniciar contenedor
echo "🚀 Iniciando contenedor..."
docker run -d -p ${TEST_PORT}:80 --name "$CONTAINER_NAME" "$IMAGE_NAME" > /dev/null

# Esperar a que nginx inicie
echo "⏳ Esperando a que nginx inicie (4 segundos)..."
sleep 4

# Verificar que el contenedor está corriendo
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ ERROR: El contenedor no está corriendo"
    echo "📋 Logs del contenedor:"
    docker logs "$CONTAINER_NAME" 2>&1 | tail -20
    docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
    exit 1
fi

echo "✅ Contenedor está corriendo"
echo ""

# Test 1: Verificar procesos nginx
echo "🔍 Test 1: Verificando procesos nginx..."
NGINX_PROCESSES=$(docker exec "$CONTAINER_NAME" ps aux | grep -c "nginx" || echo "0")
if [ "$NGINX_PROCESSES" -ge 2 ]; then
    echo "   ✅ Nginx está corriendo ($NGINX_PROCESSES procesos encontrados)"
else
    echo "   ❌ ERROR: Nginx no está corriendo correctamente"
    docker stop "$CONTAINER_NAME" > /dev/null
    docker rm "$CONTAINER_NAME" > /dev/null
    exit 1
fi
echo ""

# Test 2: Health check endpoint
echo "🔍 Test 2: Probando health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:${TEST_PORT}/health" || echo -e "\n000")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HEALTH_CODE" = "200" ] && echo "$HEALTH_BODY" | grep -q "healthy"; then
    echo "   ✅ Health check OK: $HEALTH_BODY (HTTP $HEALTH_CODE)"
else
    echo "   ❌ ERROR: Health check falló"
    echo "   Respuesta: $HEALTH_BODY"
    echo "   Código HTTP: $HEALTH_CODE"
    docker stop "$CONTAINER_NAME" > /dev/null
    docker rm "$CONTAINER_NAME" > /dev/null
    exit 1
fi
echo ""

# Test 3: Página principal
echo "🔍 Test 3: Probando página principal..."
MAIN_RESPONSE=$(curl -s -w "\n%{http_code}" "http://localhost:${TEST_PORT}/" || echo -e "\n000")
MAIN_CODE=$(echo "$MAIN_RESPONSE" | tail -n 1)
MAIN_BODY=$(echo "$MAIN_RESPONSE" | sed '$d')

if [ "$MAIN_CODE" = "200" ] && echo "$MAIN_BODY" | grep -q "<!doctype html"; then
    echo "   ✅ Página principal OK: HTML válido (HTTP $MAIN_CODE)"
    TITLE=$(echo "$MAIN_BODY" | grep -o "<title>.*</title>" | head -1 || echo "No title found")
    echo "   📄 $TITLE"
else
    echo "   ❌ ERROR: Página principal falló"
    echo "   Código HTTP: $MAIN_CODE"
    echo "   Primeras líneas: $(echo "$MAIN_BODY" | head -3)"
    docker stop "$CONTAINER_NAME" > /dev/null
    docker rm "$CONTAINER_NAME" > /dev/null
    exit 1
fi
echo ""

# Test 4: Verificar configuración de nginx
echo "🔍 Test 4: Verificando configuración de nginx..."
NGINX_CONFIG=$(docker exec "$CONTAINER_NAME" cat /etc/nginx/conf.d/default.conf 2>/dev/null || echo "")
if echo "$NGINX_CONFIG" | grep -q "listen.*80"; then
    echo "   ✅ Configuración de nginx correcta (escuchando en puerto 80)"
else
    echo "   ⚠️  ADVERTENCIA: Configuración de nginx podría tener problemas"
    echo "   Config: $(echo "$NGINX_CONFIG" | head -3)"
fi
echo ""

# Limpiar
echo "🧹 Limpiando contenedor de prueba..."
docker stop "$CONTAINER_NAME" > /dev/null
docker rm "$CONTAINER_NAME" > /dev/null

echo ""
echo "✅ ✅ ✅ TODOS LOS TESTS PASARON ✅ ✅ ✅"
echo ""
echo "🎉 La imagen $IMAGE_NAME está funcionando correctamente"
echo "🚀 Lista para desplegar en Railway"
