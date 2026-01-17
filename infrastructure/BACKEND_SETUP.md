# Configuración del Backend HTTP para Terraform

Guía para configurar el backend HTTP de Terraform en Railway para uso local y en GitHub Actions.

## ⚠️ Importante: Primer Deployment

Hay una dependencia circular: necesitas el backend para desplegar, pero necesitas desplegar para crear el backend.

### Solución: Primer Deployment Manual

Para el primer deployment, necesitas desplegar sin el backend remoto:

**Opción 1: Deployment local (Recomendado para el primer deployment)**

```bash
cd infrastructure

# 1. Inicializar sin backend remoto (usa estado local)
terraform init

# 2. Desplegar la infraestructura (esto creará el servicio terraform-backend)
terraform apply

# 3. Después del deployment, configura el backend y migra el estado (ver abajo)
```

**Opción 2: Usar backend local temporal en GitHub Actions**

Para el primer deployment en CI/CD, el workflow fallará si no hay `TF_BACKEND_URL` configurado. Necesitas:

1. Hacer el primer deployment manualmente (localmente o desde tu máquina)
2. Obtener la URL del backend
3. Configurar `TF_BACKEND_URL` en GitHub
4. Luego el workflow funcionará automáticamente

## Configuración Inicial (Después del Primer Deployment)

### 1. El servicio terraform-backend ya está desplegado

Después del primer `terraform apply`, el servicio `terraform-backend` ya existe en Railway.

### 2. Configurar Volume persistente

**IMPORTANTE**: Después del primer deployment:

1. Ve a Railway Dashboard → tu proyecto → servicio `terraform-backend`
2. Ve a **Settings → Volumes**
3. Crea un nuevo Volume (ej: `terraform-state`)
4. Móntalo en `/app/state`
5. Esto garantiza que el estado persista entre deployments

### 3. Obtener la URL del backend

1. Ve a **Settings → Networking** del servicio `terraform-backend`
2. Genera un dominio público o usa el dominio automático de Railway
3. Copia la URL completa (ej: `https://terraform-backend-xxxx.up.railway.app`)

## Configuración Local

### Opción 1: Usar archivo backend.hcl (Recomendado)

```bash
cd infrastructure
cp backend.hcl.example backend.hcl
```

Edita `backend.hcl` con la URL de tu servicio:

```hcl
address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate"
lock_address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
unlock_address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
lock_method = "POST"
unlock_method = "DELETE"
retry_max = 5
retry_wait_min = 1
```

Luego inicializa:

```bash
terraform init -backend-config=backend.hcl
```

### Opción 2: Desarrollo local con localhost

Si quieres probar localmente sin el backend remoto:

```bash
# Inicia el servicio de backend localmente
cd infrastructure/terraform-backend
npm install
npm start

# En otra terminal, inicializa Terraform
cd infrastructure
terraform init  # Usará localhost:3000 por defecto
```

## Configuración en GitHub Actions

### Paso 1: Agregar secreto en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings → Secrets and variables → Actions**
3. Agrega un nuevo secreto:
   - **Nombre**: `TF_BACKEND_URL`
   - **Valor**: La URL completa del backend (sin `/terraform.tfstate`)
   - Ejemplo: `https://terraform-backend-xxxx.up.railway.app`

### Paso 2: El workflow se configura automáticamente

El workflow de GitHub Actions (`deploy.yml`) crea automáticamente el archivo `backend.hcl` usando el secreto `TF_BACKEND_URL`. No necesitas hacer nada más.

## Migrar Estado Local a Remoto

**IMPORTANTE**: Después del primer deployment manual, necesitas migrar el estado al backend remoto:

```bash
cd infrastructure

# 1. Obtén la URL del servicio terraform-backend desde Railway Dashboard
# Ejemplo: https://terraform-backend-xxxx.up.railway.app

# 2. Configura el backend
cp backend.hcl.example backend.hcl
# Edita backend.hcl con la URL de tu servicio (sin /terraform.tfstate al final)

# 3. Inicializa con migración
terraform init -migrate-state -backend-config=backend.hcl

# 4. Confirma la migración cuando se te pregunte (escribe "yes")
# Esto moverá tu estado local al backend remoto

# 5. Verifica que funcionó
terraform state list
```

**Para GitHub Actions**: Después de migrar el estado localmente, agrega el secreto `TF_BACKEND_URL` en GitHub y el workflow usará el backend remoto automáticamente.

## Verificar Configuración

### Verificar que el backend funciona

```bash
# Health check
curl https://tu-backend.railway.app/health

# Debería responder: {"status":"ok","timestamp":"..."}
```

### Verificar configuración de Terraform

```bash
cd infrastructure
terraform init -backend-config=backend.hcl
terraform state list  # Debería funcionar sin errores
```

## Troubleshooting

### Error: "connection refused" en GitHub Actions

**Causa**: El secreto `TF_BACKEND_URL` no está configurado o es incorrecto.

**Solución**:
1. Verifica que el secreto `TF_BACKEND_URL` esté configurado en GitHub
2. Verifica que la URL sea correcta (sin `/terraform.tfstate` al final)
3. Asegúrate de que el servicio `terraform-backend` esté desplegado y funcionando

### Error: "State not found" en el primer uso

**Causa**: Es normal, el estado se creará automáticamente en el primer `terraform apply`.

**Solución**: No es un error, simplemente ejecuta `terraform apply` y el estado se creará.

### El estado no persiste entre deployments

**Causa**: El Volume no está montado correctamente.

**Solución**:
1. Verifica en Railway Dashboard que el Volume esté montado en `/app/state`
2. Reinicia el servicio si es necesario

### Lock no se libera

**Causa**: Un proceso anterior no liberó el lock correctamente.

**Solución**:
1. Reinicia el servicio `terraform-backend` desde Railway Dashboard
2. O elimina manualmente el archivo de lock desde el Volume

## Seguridad

⚠️ **Importante**: El backend HTTP básico no incluye autenticación por defecto. Para producción:

1. **Usa HTTPS**: Railway lo proporciona automáticamente
2. **Considera agregar autenticación**: Modifica `server.js` para agregar autenticación básica o tokens
3. **Restringe acceso**: Usa Railway networking settings para restringir el acceso

### Agregar autenticación básica (opcional)

Si quieres agregar autenticación, modifica `terraform-backend/server.js` y agrega middleware de autenticación. Luego configura `username` y `password` en `backend.hcl`.
