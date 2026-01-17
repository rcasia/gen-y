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

variable "generate_domain" {
  description = "Whether to generate a public domain for the service"
  type        = bool
  default     = true
}

variable "service_subdomain" {
  description = "Subdomain for the service domain (e.g., 'web' for web-production.up.railway.app)"
  type        = string
  default     = "web"
}
