# Solución: No hay Active Deployments

Si Railway dice "no active deployments for this service", significa que el servicio está creado pero no está conectado a un repositorio o no se ha desplegado.

## 🔧 Solución Rápida

### Opción 1: Conectar Repositorio desde Railway Dashboard (Recomendado)

1. Ve a [Railway Dashboard](https://railway.app)
2. Selecciona tu proyecto
3. Selecciona el servicio "web"
4. Ve a **Settings** → **Source**
5. Haz clic en **Connect GitHub Repo**
6. Selecciona tu repositorio
7. Configura:
   - **Root Directory**: Deja vacío (o pon `.` si no funciona)
   - **Dockerfile Path**: `infrastructure/Dockerfile`
8. Railway comenzará a desplegar automáticamente

### Opción 2: Usar Railway CLI

```bash
# Conectar el repositorio
railway link

# Configurar el root directory y Dockerfile
railway variables set RAILWAY_DOCKERFILE_PATH=infrastructure/Dockerfile

# Generar dominio público
railway domain

# Forzar un nuevo deployment
railway up
```

### Opción 3: Crear railway.json en la raíz

Crea un archivo `railway.json` en la raíz del proyecto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "infrastructure/Dockerfile"
  },
  "deploy": {
    "startCommand": "nginx -g 'daemon off;'",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Luego conecta el repositorio desde el dashboard.

## 🌐 Generar Dominio Público

Después de conectar el repositorio:

1. Ve a **Settings** → **Networking**
2. Haz clic en **Generate Domain**
3. Railway generará una URL como: `https://tu-servicio-production.up.railway.app`

## ✅ Verificar Deployment

1. Ve a la pestaña **Deployments**
2. Deberías ver un deployment en progreso o completado
3. Si falla, revisa los logs en la pestaña **Logs**

## 🐛 Troubleshooting

### El deployment falla

Revisa los logs:
- ¿El Dockerfile se encuentra correctamente?
- ¿El build se completa sin errores?
- ¿Nginx inicia correctamente?

### No aparece el dominio

- Ve a **Settings** → **Networking**
- Haz clic en **Generate Domain**
- Espera unos segundos para que se propague

### El servicio no inicia

Verifica que:
- El puerto esté configurado correctamente (80 para nginx)
- Nginx esté escuchando en `0.0.0.0` (ya está configurado en nginx.conf)
- No haya errores en los logs
