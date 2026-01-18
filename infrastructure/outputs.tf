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

output "minio_service_id" {
  description = "MinIO S3 service ID"
  value       = railway_service.minio.id
}

output "minio_service_url" {
  description = "MinIO service dashboard URL"
  value       = "https://railway.app/project/${railway_project.main.id}/service/${railway_service.minio.id}"
}

output "minio_instructions" {
  description = "Instrucciones para configurar el backend S3"
  value       = "Después del deployment, obtén la URL pública de MinIO desde Railway Dashboard y configúrala en backend.hcl"
}
