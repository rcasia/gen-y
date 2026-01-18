# Railway Project
# Railway crea automáticamente un environment por defecto al crear el proyecto
resource "railway_project" "main" {
  name = var.project_name
}

# MinIO S3 Service (Simple S3)
# Servicio S3-compatible para almacenar el estado de Terraform
# Se despliega ANTES que la app para que el backend S3 esté disponible
resource "railway_service" "minio" {
  project_id = railway_project.main.id
  name       = "minio-s3"
  
  # Usar la imagen oficial de MinIO
  # Railway detectará automáticamente que es un servicio Docker
}

# Variables de entorno para MinIO
resource "railway_variable" "minio_root_user" {
  service_id     = railway_service.minio.id
  environment_id = railway_project.main.default_environment.id
  name           = "MINIO_ROOT_USER"
  value          = var.minio_root_user
}

resource "railway_variable" "minio_root_password" {
  service_id     = railway_service.minio.id
  environment_id = railway_project.main.default_environment.id
  name           = "MINIO_ROOT_PASSWORD"
  value          = var.minio_root_password
  sensitive      = true
}

resource "railway_variable" "minio_bucket" {
  service_id     = railway_service.minio.id
  environment_id = railway_project.main.default_environment.id
  name           = "MINIO_BUCKET"
  value          = var.minio_bucket
}

# Railway Service (App Web)
# Conecta el repositorio de GitHub y configura el despliegue
# DEPENDS_ON: Se despliega después de MinIO para que el backend S3 esté disponible
resource "railway_service" "web" {
  project_id = railway_project.main.id
  name       = var.service_name
  
  # Conectar repositorio de GitHub si se proporciona
  # Formato: "owner/repo" (ej: "ricardocasia/genY")
  source_repo       = var.github_repo != "" ? var.github_repo : null
  source_repo_branch = var.github_repo != "" ? var.github_branch : null
  
  # Directorio raíz (vacío = raíz del repo)
  # Railway detectará automáticamente railway.json en la raíz
  root_directory = var.root_directory != "" ? var.root_directory : null
  
  # Asegurar que MinIO se despliegue primero
  depends_on = [railway_service.minio]
}

# Railway Variables de Entorno
# Usamos el environment por defecto del proyecto
# El provider comunitario requiere: service_id, environment_id, name y value
resource "railway_variable" "node_env" {
  service_id     = railway_service.web.id
  environment_id = railway_project.main.default_environment.id
  name           = "NODE_ENV"
  value          = var.environment
}

resource "railway_variable" "port" {
  service_id     = railway_service.web.id
  environment_id = railway_project.main.default_environment.id
  name           = "PORT"
  value          = tostring(var.port)
}

# Nota: Railway genera automáticamente un dominio público cuando:
# 1. El servicio está conectado a un repositorio (source_repo)
# 2. Hay un deployment exitoso
# No es necesario crear el dominio manualmente con Terraform

# Railway Custom Domain (si se proporciona)
# El provider comunitario soporta railway_custom_domain
resource "railway_custom_domain" "custom" {
  count = var.domain != "" ? 1 : 0
  
  service_id     = railway_service.web.id
  environment_id = railway_project.main.default_environment.id
  domain         = var.domain
}
