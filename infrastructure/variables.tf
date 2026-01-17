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
