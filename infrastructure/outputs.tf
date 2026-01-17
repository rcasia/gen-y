output "project_id" {
  description = "Railway project ID"
  value       = railway_project.main.id
}

output "service_id" {
  description = "Railway service ID"
  value       = railway_service.web.id
}

output "service_name" {
  description = "Railway service name"
  value       = railway_service.web.name
}

output "service_url" {
  description = "Railway service dashboard URL"
  value       = "https://railway.app/project/${railway_project.main.id}/service/${railway_service.web.id}"
}

output "public_domain" {
  description = "Public domain URL for the service (generado automáticamente por Railway después del primer deployment exitoso)"
  value       = "Consulta el dominio en: https://railway.app/project/${railway_project.main.id}/service/${railway_service.web.id}/settings/networking"
}

output "custom_domain" {
  description = "Dominio personalizado configurado"
  value       = var.domain != "" ? railway_custom_domain.custom[0].domain : "No configurado"
}

output "custom_domain_dns" {
  description = "Valor DNS para configurar el dominio personalizado"
  value       = var.domain != "" ? railway_custom_domain.custom[0].dns_record_value : null
}

output "environment_id" {
  description = "Railway environment ID (default environment)"
  value       = railway_project.main.default_environment.id
}

output "terraform_backend_service_id" {
  description = "Railway service ID for Terraform backend"
  value       = railway_service.terraform_backend.id
}

output "terraform_backend_url" {
  description = "URL del backend de Terraform (configurar después del primer deployment)"
  value       = "https://railway.app/project/${railway_project.main.id}/service/${railway_service.terraform_backend.id}"
}

output "terraform_backend_instructions" {
  description = "Instrucciones para configurar el backend HTTP"
  value       = "Después del primer deployment, obtén la URL pública del servicio terraform-backend desde Railway Dashboard y configúrala en backend.hcl"
}
