# Infraestructura con Terraform para Railway

Esta carpeta contiene toda la configuración de infraestructura como código (IaC) usando Terraform para desplegar la aplicación en Railway.

## ⚠️ Importante: Provider Comunitario

**Railway no tiene un provider oficial de Terraform**. Este proyecto usa el provider comunitario `terraform-community-providers/railway`, que es mantenido por la comunidad y puede tener limitaciones.

Si encuentras problemas con Terraform, consulta [ALTERNATIVA.md](ALTERNATIVA.md) para usar Railway CLI directamente.

## 📁 Estructura

```
infrastructure/
├── main.tf              # Recursos principales de Railway
├── variables.tf          # Variables de configuración
├── outputs.tf           # Outputs de Terraform
├── provider.tf          # Configuración del provider
├── versions.tf          # Versiones de Terraform y providers
├── terraform.tfvars.example  # Ejemplo de variables
├── Dockerfile           # Dockerfile para construir la imagen
├── .dockerignore        # Archivos a ignorar en Docker
├── nginx.conf           # Configuración de nginx
├── docker-compose.yml   # Para pruebas locales
└── build.sh            # Script de ayuda para build local
```

## 🚀 Inicio Rápido

### Prerrequisitos

1. **Terraform** instalado (>= 1.0)
   ```bash
   # macOS
   brew install terraform
   
   # O descarga desde https://www.terraform.io/downloads
   ```

2. **Railway CLI** (opcional pero recomendado)
   ```bash
   npm i -g @railway/cli
   railway login
   ```

3. **Railway API Token**
   - Ve a [railway.app/account/tokens](https://railway.app/account/tokens)
   - Crea un nuevo token
   - Guárdalo de forma segura

### Configuración

1. **Copia el archivo de ejemplo de variables:**
   ```bash
   cd infrastructure
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edita `terraform.tfvars` con tus valores:**
   ```hcl
   railway_token = "tu-token-de-railway"
   project_name   = "geny-market"
   service_name   = "web"
   environment    = "production"
   ```

3. **Configura el token de Railway:**
   ```bash
   export RAILWAY_TOKEN="tu-token-de-railway"
   ```

### Uso de Terraform

#### Inicializar Terraform

**Primero, despliega la infraestructura (incluye el backend HTTP)**:

```bash
cd infrastructure
terraform init
terraform apply
```

**Luego, configura el backend HTTP**:

1. Configura el Volume persistente en Railway Dashboard (ver sección "Estado de Terraform" arriba)
2. Obtén la URL pública del servicio `terraform-backend`
3. Configura `backend.hcl`:

```bash
cp backend.hcl.example backend.hcl
# Edita backend.hcl con la URL de tu servicio
terraform init -backend-config=backend.hcl -migrate-state
```

**Nota**: Si `terraform init` falla, el provider puede no estar disponible o tener problemas. En ese caso, usa la alternativa con Railway CLI (ver [ALTERNATIVA.md](ALTERNATIVA.md) o ejecuta `./deploy.sh`).

#### Planificar cambios

```bash
terraform plan
```

Esto mostrará qué recursos se crearán/modificarán sin aplicar cambios.

#### Aplicar cambios

```bash
terraform apply
```

Esto creará/actualizará los recursos en Railway. Terraform te pedirá confirmación antes de aplicar.

#### Aplicar automáticamente (sin confirmación)

```bash
terraform apply -auto-approve
```

#### Ver outputs

```bash
terraform output
```

Esto mostrará las URLs y IDs de los recursos creados.

#### Destruir infraestructura

```bash
terraform destroy
```

⚠️ **Cuidado**: Esto eliminará todos los recursos creados por Terraform.

## 🔧 Variables Disponibles

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `railway_token` | Token de API de Railway | - | ✅ Sí |
| `project_name` | Nombre del proyecto en Railway | `geny-market` | No |
| `service_name` | Nombre del servicio | `web` | No |
| `environment` | Ambiente (production/staging/dev) | `production` | No |
| `region` | Región de Railway | `us-west` | No |
| `domain` | Dominio personalizado (opcional) | `""` | No |
| `port` | Puerto de la aplicación | `80` | No |
| `github_repo` | Repositorio GitHub (formato: `owner/repo`) | `""` | No* |
| `github_branch` | Rama de GitHub a desplegar | `main` | No |
| `root_directory` | Directorio raíz del servicio | `""` | No |
| `generate_domain` | Generar dominio público automáticamente | `true` | No |
| `service_subdomain` | Subdominio para el servicio | `web` | No |

\* **Requerido para despliegue automático**: Si no se proporciona `github_repo`, el servicio se creará pero no se conectará a ningún repositorio y no habrá deployments automáticos.

## 🐳 Docker

### Build Local

```bash
# Desde la raíz del proyecto
docker build -f infrastructure/Dockerfile -t geny-market:latest .

# O usar el script
./infrastructure/build.sh
```

### Ejecutar Localmente

```bash
docker run -p 3000:80 geny-market:latest
```

O con docker-compose:

```bash
docker-compose -f infrastructure/docker-compose.yml up
```

## 📝 Workflow Recomendado

1. **Desarrollo Local:**
   ```bash
   pnpm run dev
   ```

2. **Probar Build:**
   ```bash
   pnpm run build
   docker build -f infrastructure/Dockerfile -t geny-market:latest .
   docker run -p 3000:80 geny-market:latest
   ```

3. **Desplegar con Terraform:**
   ```bash
   cd infrastructure
   terraform plan
   terraform apply
   ```

4. **Verificar Deployment:**
   ```bash
   terraform output deployment_url
   ```

## 🔐 Seguridad

- **NUNCA** subas `terraform.tfvars` al repositorio (está en .gitignore)
- Usa variables de entorno para tokens sensibles
- Considera usar un backend remoto para el estado de Terraform
- Rota los tokens de Railway regularmente

## 🐛 Troubleshooting

### Error: "provider registry does not have a provider named railwayapp/railway"

El provider oficial no existe. La configuración usa el provider comunitario `terraform-community-providers/railway`. Si aún así falla:

1. Verifica que `versions.tf` use el source correcto: `terraform-community-providers/railway`
2. Si el provider comunitario tampoco funciona, usa la alternativa con Railway CLI:
   ```bash
   ./deploy.sh
   ```
   O consulta [ALTERNATIVA.md](ALTERNATIVA.md)

### Error: "Invalid token"
Verifica que `RAILWAY_TOKEN` esté configurado correctamente:
```bash
echo $RAILWAY_TOKEN
```

O configúralo en `terraform.tfvars`:
```hcl
railway_token = "tu-token-aqui"
```

### Error: "Project already exists"
Railway no permite proyectos duplicados. Cambia `project_name` en `terraform.tfvars` o elimina el proyecto existente.

### El Dockerfile no se encuentra
Asegúrate de ejecutar los comandos desde la raíz del proyecto, no desde `infrastructure/`.

### Provider comunitario tiene limitaciones
Si el provider comunitario no soporta algún recurso o tiene errores, usa Railway CLI directamente (ver [ALTERNATIVA.md](ALTERNATIVA.md)).

### No hay Active Deployments / No hay URL
Si Railway dice "no active deployments for this service", el servicio está creado pero no está conectado a un repositorio. **Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para la solución completa.**

Pasos rápidos:
1. Ve a Railway Dashboard → tu proyecto → servicio "web"
2. Settings → Source → Connect GitHub Repo
3. Selecciona tu repositorio
4. Settings → Networking → Generate Domain

## 📚 Recursos

- [Terraform Railway Provider](https://registry.terraform.io/providers/railwayapp/railway/latest/docs)
- [Railway Documentation](https://docs.railway.app)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Terraform HTTP Backend](https://www.terraform.io/language/settings/backends/http)
- [Servicio Backend HTTP](terraform-backend/README.md) - Documentación del servicio de backend

## 🔄 Actualizar Infraestructura

Cuando hagas cambios en los archivos `.tf`:

1. Revisa los cambios: `terraform plan`
2. Aplica los cambios: `terraform apply`
3. Verifica los outputs: `terraform output`

## 📦 Estado de Terraform (Backend HTTP en Railway)

El estado de Terraform está configurado para usar un **backend HTTP remoto** desplegado en Railway. Esto significa que:

- ✅ El estado se almacena en un servicio dentro de tu infraestructura de Railway
- ✅ Usa Volumes persistentes de Railway para garantizar persistencia
- ✅ Múltiples desarrolladores pueden trabajar sin conflictos (con locks)
- ✅ Todo está dentro de tu propia infraestructura
- ✅ Sin dependencias externas

### Arquitectura

El backend consiste en:
1. **Servicio HTTP** (`terraform-backend`) - Servicio Node.js que expone una API REST
2. **Volume persistente** - Almacena el estado de forma permanente
3. **Desplegado en Railway** - Parte de tu misma infraestructura

### Configuración Inicial

#### Paso 1: Desplegar la infraestructura (incluye el backend)

```bash
cd infrastructure
terraform init
terraform apply
```

Esto creará el servicio `terraform-backend` en Railway.

#### Paso 2: Configurar Volume persistente

**IMPORTANTE**: Después del primer deployment:

1. Ve a Railway Dashboard → tu proyecto → servicio `terraform-backend`
2. Ve a **Settings → Volumes**
3. Crea un nuevo Volume (ej: `terraform-state`)
4. Móntalo en `/app/state`
5. Esto garantiza que el estado persista entre deployments

#### Paso 3: Obtener la URL del backend

1. Ve a **Settings → Networking** del servicio `terraform-backend`
2. Genera un dominio público o usa el dominio automático de Railway
3. Copia la URL (ej: `https://terraform-backend-xxxx.up.railway.app`)

#### Paso 4: Configurar Terraform para usar el backend

```bash
cd infrastructure
cp backend.hcl.example backend.hcl
```

Edita `backend.hcl` con la URL de tu servicio:

```hcl
address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate"
lock_address   = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
unlock_address = "https://terraform-backend-xxxx.up.railway.app/terraform.tfstate/lock"
lock_method   = "POST"
unlock_method = "DELETE"
retry_max      = 5
retry_wait_min = 1
```

#### Paso 5: Inicializar Terraform con el backend

```bash
terraform init -backend-config=backend.hcl
```

Si ya tienes un estado local, Terraform te preguntará si quieres migrarlo. Responde `yes`.

### Migrar Estado Local a Remoto

Si ya tienes un estado local:

```bash
cd infrastructure

# 1. Configura el backend
cp backend.hcl.example backend.hcl
# Edita backend.hcl con la URL de tu servicio

# 2. Inicializa con migración
terraform init -migrate-state -backend-config=backend.hcl

# 3. Confirma la migración cuando se te pregunte
```

### Verificar el Backend

Puedes verificar que el backend funciona:

```bash
# Health check
curl https://tu-backend.railway.app/health

# Ver estado (requiere autenticación si la configuraste)
curl https://tu-backend.railway.app/terraform.tfstate
```

### Seguridad

⚠️ **Importante**: El backend HTTP básico no incluye autenticación. Para producción:

1. Usa HTTPS (Railway lo proporciona automáticamente)
2. Considera agregar autenticación básica o tokens al servicio
3. Restringe el acceso mediante Railway networking settings

### Troubleshooting

**El estado no persiste:**
- Verifica que el Volume esté montado en `/app/state` en Railway Dashboard

**Error 404 al obtener estado:**
- Es normal en el primer uso, el estado se creará automáticamente

**Lock no se libera:**
- Reinicia el servicio desde Railway Dashboard
- O elimina manualmente el archivo de lock desde el Volume

### Documentación del Servicio

Ver [terraform-backend/README.md](terraform-backend/README.md) para más detalles sobre el servicio.
