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

# Railway Service Domain (dominio público generado automáticamente)
# Railway genera un dominio público para el servicio
resource "railway_service_domain" "public" {
  count = var.generate_domain ? 1 : 0
  
  service_id     = railway_service.web.id
  environment_id = railway_project.main.default_environment.id
  subdomain      = var.service_subdomain
}

# Railway Custom Domain (si se proporciona)
# El provider comunitario soporta railway_custom_domain
resource "railway_custom_domain" "custom" {
  count = var.domain != "" ? 1 : 0
  
  service_id     = railway_service.web.id
  environment_id = railway_project.main.default_environment.id
  domain         = var.domain
}
