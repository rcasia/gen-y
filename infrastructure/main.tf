# Railway Project
# Railway crea automáticamente un environment por defecto al crear el proyecto
resource "railway_project" "main" {
  name = var.project_name
}

# Railway Service
# Conecta el repositorio de GitHub y configura el despliegue
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

# Terraform Backend Service
# Servicio HTTP simple para almacenar el estado de Terraform
# Usa un Volume persistente de Railway para almacenar el estado
resource "railway_service" "terraform_backend" {
  project_id = railway_project.main.id
  name       = "terraform-backend"
  
  # Conectar repositorio de GitHub si se proporciona
  source_repo       = var.github_repo != "" ? var.github_repo : null
  source_repo_branch = var.github_repo != "" ? var.github_branch : null
  
  # Directorio raíz apunta a la carpeta del backend
  root_directory = "infrastructure/terraform-backend"
}

# Variables de entorno para el backend de Terraform
resource "railway_variable" "backend_state_dir" {
  service_id     = railway_service.terraform_backend.id
  environment_id = railway_project.main.default_environment.id
  name           = "STATE_DIR"
  value          = "/app/state"
}

resource "railway_variable" "backend_port" {
  service_id     = railway_service.terraform_backend.id
  environment_id = railway_project.main.default_environment.id
  name           = "PORT"
  value          = "3000"
}
