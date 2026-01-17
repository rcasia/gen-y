# Terraform Backend HTTP Service

Servicio HTTP simple para almacenar el estado de Terraform en Railway usando Volumes persistentes.

## Descripción

Este servicio implementa el protocolo HTTP backend de Terraform, permitiendo almacenar el estado de forma remota en Railway. El estado se guarda en un Volume persistente de Railway, lo que garantiza que persista entre deployments.

## Características

- ✅ Almacenamiento persistente en Volumes de Railway
- ✅ Soporte para locks (bloqueo de estado)
- ✅ API REST simple y compatible con Terraform HTTP backend
- ✅ Health check endpoint
- ✅ Sin dependencias externas (solo Node.js)

## Endpoints

El servicio implementa los siguientes endpoints requeridos por Terraform:

- `GET /<key>` - Obtener el estado
- `POST /<key>` - Guardar el estado
- `POST /<key>/lock` - Bloquear el estado
- `DELETE /<key>/lock` - Desbloquear el estado
- `GET /health` - Health check

## Configuración en Railway

### 1. Desplegar el servicio

El servicio se despliega automáticamente cuando ejecutas `terraform apply` ya que está definido en `main.tf`.

### 2. Configurar Volume persistente

**IMPORTANTE**: Después del primer deployment, debes configurar un Volume en Railway:

1. Ve a Railway Dashboard → tu proyecto → servicio `terraform-backend`
2. Ve a **Settings → Volumes**
3. Crea un nuevo Volume y móntalo en `/app/state`
4. Esto asegura que el estado persista entre deployments

### 3. Obtener la URL pública

1. Ve a **Settings → Networking**
2. Genera un dominio público o usa el dominio automático
3. Copia la URL (ej: `https://terraform-backend-xxxx.up.railway.app`)

### 4. Configurar Terraform para usar el backend

Crea `backend.hcl` con la URL de tu servicio:

```hcl
address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate"
lock_address   = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
unlock_address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
lock_method   = "POST"
unlock_method = "DELETE"
retry_max      = 5
retry_wait_min = 1
```

Luego inicializa Terraform:

```bash
terraform init -backend-config=backend.hcl
```

## Variables de Entorno

- `PORT`: Puerto del servidor (default: 3000)
- `STATE_DIR`: Directorio donde se almacena el estado (default: `/app/state`)

## Desarrollo Local

Para probar localmente:

```bash
cd infrastructure/terraform-backend
npm install
npm start
```

El servicio estará disponible en `http://localhost:3000`.

## Seguridad

⚠️ **Importante**: Este servicio no incluye autenticación por defecto. Para producción, considera:

1. Usar un dominio personalizado con HTTPS
2. Agregar autenticación básica o tokens
3. Restringir el acceso mediante variables de entorno o Railway networking

## Troubleshooting

### El estado no persiste

- Verifica que el Volume esté montado correctamente en `/app/state`
- Revisa los logs del servicio en Railway Dashboard

### Error 404 al obtener estado

- Es normal si es la primera vez que usas el backend
- El estado se creará automáticamente en el primer `terraform apply`

### Lock no se libera

- Puedes eliminar manualmente el lock desde Railway Dashboard → Volumes
- O reiniciar el servicio para limpiar locks antiguos

## Estructura del Estado

El estado se almacena en:
- Estado: `/app/state/terraform.tfstate`
- Locks: `/app/state/.locks/terraform.tfstate.lock`
