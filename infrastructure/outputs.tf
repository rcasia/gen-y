output "project_id" {
  description = "Railway project ID"
  value       = railway_project.main.id
}

output "service_id" {
  description = "Railway service ID"
  value       = railway_service.web.id
}

output "deployment_url" {
  description = "URL del servicio desplegado (consulta en Railway dashboard)"
  value       = "Consulta la URL en: https://railway.app/project/${railway_project.main.id}/service/${railway_service.web.id}"
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
  description = "Railway environment ID"
  value       = railway_environment.main.id
}
