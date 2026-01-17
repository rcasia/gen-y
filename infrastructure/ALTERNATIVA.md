# Alternativa: Railway CLI + Scripts

Si el provider de Terraform no funciona o tiene limitaciones, puedes usar Railway CLI directamente con scripts de automatización.

## Opción 1: Railway CLI Directo

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Configurar variables
railway variables set NODE_ENV=production
railway variables set PORT=80

# Desplegar
railway up
```

## Opción 2: Scripts de Automatización

Crea un script `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Desplegando en Railway..."

# Verificar que Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no está instalado"
    echo "Instala con: npm i -g @railway/cli"
    exit 1
fi

# Login (si no está logueado)
railway whoami || railway login

# Inicializar proyecto (si no existe)
if [ ! -f .railway/project.json ]; then
    railway init
fi

# Configurar variables de entorno
railway variables set NODE_ENV=production
railway variables set PORT=80

# Desplegar
railway up

echo "✅ Despliegue completado"
railway status
```

## Opción 3: Railway Config as Code

Railway soporta configuración como código con `railway.json` o `railway.toml`:

### railway.json

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

### railway.toml

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "infrastructure/Dockerfile"

[deploy]
startCommand = "nginx -g 'daemon off;'"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[env]
NODE_ENV = "production"
PORT = "80"
```

Coloca estos archivos en la raíz del proyecto y Railway los usará automáticamente.
