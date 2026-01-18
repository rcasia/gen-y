#!/bin/sh
set -e

# Railway proporciona PORT como variable de entorno
# Si no está definida, usar 80 por defecto
PORT=${PORT:-80}
export PORT

# Copiar configuración principal de nginx (limita workers a 1)
if [ -f /etc/nginx/nginx-main.conf ]; then
    cp /etc/nginx/nginx-main.conf /etc/nginx/nginx.conf
fi

# Generar configuración de nginx con el puerto correcto
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Iniciar nginx
exec nginx -g 'daemon off;'
