variable "railway_token" {
  description = "Railway API token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the Railway project"
  type        = string
  default     = "geny-market"
}

variable "service_name" {
  description = "Name of the Railway service"
  type        = string
  default     = "web"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  default     = "production"
}

variable "region" {
  description = "Railway region"
  type        = string
  default     = "us-west"
}

variable "domain" {
  description = "Custom domain for the application (optional)"
  type        = string
  default     = ""
}

variable "port" {
  description = "Port the application listens on"
  type        = number
  default     = 80
}

variable "github_repo" {
  description = "GitHub repository in format 'owner/repo' (e.g., 'username/genY')"
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "GitHub branch to deploy from"
  type        = string
  default     = "main"
}

variable "root_directory" {
  description = "Root directory for the service (leave empty for root)"
  type        = string
  default     = ""
}

# Nota: Railway genera automáticamente el dominio público cuando hay un deployment exitoso
# No es necesario configurar estas variables, pero las mantenemos por compatibilidad
variable "generate_domain" {
  description = "Deprecated: Railway genera el dominio automáticamente. Se mantiene por compatibilidad."
  type        = bool
  default     = true
}

variable "service_subdomain" {
  description = "Deprecated: Railway genera el dominio automáticamente. Se mantiene por compatibilidad."
  type        = string
  default     = "web"
}

# MinIO S3 Configuration
variable "minio_root_user" {
  description = "MinIO root user (access key)"
  type        = string
  default     = "minioadmin"
}

variable "minio_root_password" {
  description = "MinIO root password (secret key)"
  type        = string
  sensitive   = true
  default     = "minioadmin"
}

variable "minio_bucket" {
  description = "MinIO bucket name for Terraform state"
  type        = string
  default     = "terraform-state"
}
