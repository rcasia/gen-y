# Configuración de MinIO S3 para Backend de Terraform

Esta guía explica cómo configurar MinIO (Simple S3) en Railway para usar como backend de Terraform.

## ⚠️ Importante: Orden de Deployment

MinIO **debe desplegarse ANTES** que la aplicación web para que el backend S3 esté disponible. Terraform está configurado con `depends_on` para asegurar este orden.

## Opción 1: Usar el Template de Railway (Recomendado)

### Paso 1: Desplegar MinIO usando el Template

1. Ve a [Railway Simple S3 Template](https://railway.com/deploy/simple-s3)
2. Haz clic en **"Deploy Now"**
3. Conecta tu repositorio de GitHub
4. Railway creará automáticamente:
   - Servicio MinIO con la imagen `minio/minio`
   - Volume persistente en `/data`
   - Variables de entorno necesarias

### Paso 2: Configurar Variables en el Template

En el template, configura:
- **MINIO_BUCKET**: `terraform-state` (o el nombre que prefieras)
- **MINIO_ROOT_USER**: `minioadmin` (o tu usuario preferido)
- **MINIO_ROOT_PASSWORD**: Cambia esto por una contraseña segura

### Paso 3: Importar el Servicio a Terraform

Después de desplegar el template, importa el servicio a Terraform:

```bash
cd infrastructure

# Obtén el ID del servicio desde Railway Dashboard
# Ve a tu proyecto → servicio minio → Settings → Service ID

terraform import railway_service.minio <SERVICE_ID>
```

### Paso 4: Configurar Terraform para usar el Backend S3

1. Obtén la URL pública de MinIO desde Railway Dashboard
2. Configura `backend.hcl`:

```bash
cp backend.hcl.example backend.hcl
```

Edita `backend.hcl` con la URL de MinIO:

```hcl
bucket = "terraform-state"
key = "terraform.tfstate"
region = "us-east-1"
endpoint = "https://tu-minio-xxxx.up.railway.app"
access_key = "minioadmin"
secret_key = "tu-password-seguro"
skip_credentials_validation = true
skip_metadata_api_check = true
skip_region_validation = true
force_path_style = true
```

3. Inicializa Terraform con el backend:

```bash
terraform init -backend-config=backend.hcl
```

## Opción 2: Crear el Servicio con Terraform Primero

### Paso 1: Crear el Servicio en Terraform

```bash
cd infrastructure
terraform init
terraform apply
```

Esto creará el servicio `minio-s3` en Railway, pero **sin la imagen Docker configurada**.

### Paso 2: Configurar la Imagen Docker Manualmente

1. Ve a Railway Dashboard → tu proyecto → servicio `minio-s3`
2. Ve a **Settings → Source**
3. Configura:
   - **Image**: `minio/minio` (o `quay.io/minio/minio` si Docker Hub no funciona)
   - **Start Command**: `server /data --console-address ":9001"`
4. Ve a **Settings → Volumes**
5. Crea un Volume y móntalo en `/data`

### Paso 3: Configurar Variables de Entorno

Las variables ya están configuradas por Terraform, pero verifica en Railway Dashboard:
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MINIO_BUCKET`

### Paso 4: Configurar el Backend S3

Sigue los pasos del **Paso 4** de la Opción 1.

## Verificar que MinIO Funciona

### Health Check

```bash
# Obtén la URL de MinIO desde Railway Dashboard
curl https://tu-minio.railway.app/minio/health/live
```

### Acceder a la Consola Web

1. Ve a la URL pública de MinIO (Railway Dashboard → Networking)
2. Inicia sesión con:
   - Usuario: `MINIO_ROOT_USER`
   - Password: `MINIO_ROOT_PASSWORD`

### Verificar el Bucket

En la consola web de MinIO, deberías ver el bucket `terraform-state` creado automáticamente.

## Configurar GitHub Actions

Para que GitHub Actions use el backend S3:

1. Agrega los siguientes secretos en GitHub:
   - `AWS_ACCESS_KEY_ID`: Valor de `MINIO_ROOT_USER`
   - `AWS_SECRET_ACCESS_KEY`: Valor de `MINIO_ROOT_PASSWORD`
   - `AWS_ENDPOINT`: URL completa de MinIO (ej: `https://tu-minio-xxxx.up.railway.app`)
   - `TF_S3_BUCKET`: Nombre del bucket (ej: `terraform-state`)

2. El workflow creará automáticamente `backend.hcl` con estos valores.

## Troubleshooting

### Error: "Unable to find image 'minio/minio'"

**Causa**: La imagen puede no estar disponible en Docker Hub.

**Solución**: Usa una imagen alternativa:
- `quay.io/minio/minio`
- `docker.io/minio/minio:latest`

### Error: "Bucket not found"

**Causa**: El bucket no se creó automáticamente.

**Solución**: 
1. Accede a la consola web de MinIO
2. Crea el bucket manualmente con el nombre configurado en `MINIO_BUCKET`

### Error: "Access Denied" al acceder al backend

**Causa**: Credenciales incorrectas o bucket no existe.

**Solución**:
1. Verifica las credenciales en `backend.hcl`
2. Verifica que el bucket existe en MinIO
3. Asegúrate de que `force_path_style = true` está configurado

### El estado no persiste

**Causa**: El Volume no está montado correctamente.

**Solución**:
1. Verifica en Railway Dashboard que el Volume esté montado en `/data`
2. Reinicia el servicio si es necesario

## Recursos

- [Railway Simple S3 Template](https://railway.com/deploy/simple-s3)
- [MinIO Documentation](https://min.io/docs)
- [Terraform S3 Backend](https://www.terraform.io/language/settings/backends/s3)
