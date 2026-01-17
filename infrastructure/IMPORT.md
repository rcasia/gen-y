# Importar Recursos Existentes en Terraform

Si ya tienes recursos creados en Railway y quieres gestionarlos con Terraform, necesitas importarlos al estado de Terraform.

## Importar Proyecto Existente

Si el proyecto ya existe en Railway:

```bash
# 1. Obtén el ID del proyecto desde Railway dashboard
# O desde la URL: https://railway.app/project/<PROJECT_ID>

# 2. Importa el proyecto
terraform import railway_project.main <PROJECT_ID>

# Ejemplo:
# terraform import railway_project.main b75eafa8-da5c-41d1-bc8d-d5679ee4ecc2
```

## Importar Servicio Existente

Si el servicio ya existe:

```bash
# 1. Obtén el ID del servicio desde Railway dashboard

# 2. Importa el servicio
terraform import railway_service.web <SERVICE_ID>

# Ejemplo:
# terraform import railway_service.web 534724db-d5f7-4e14-a737-83fa661ac7bf
```

## Limpiar Estado y Empezar de Nuevo

Si prefieres empezar desde cero:

```bash
# ⚠️ CUIDADO: Esto eliminará el estado local de Terraform
# Los recursos en Railway NO se eliminarán, solo perderás el control con Terraform

rm terraform.tfstate terraform.tfstate.backup
rm -rf .terraform/

# Luego ejecuta terraform init de nuevo
terraform init
```

## Solución al Error "environment already exists"

Si ves el error:
```
Error: Unable to create environment, got error: input:3: environmentCreate An environment with that name already exists
```

**Solución**: Ya no necesitas crear el environment manualmente. Railway crea uno por defecto automáticamente. El código de Terraform ya está actualizado para usar `railway_project.main.default_environment.id` en lugar de crear un `railway_environment` separado.

Si ya ejecutaste `terraform apply` y falló, necesitas limpiar el estado:

```bash
# Elimina el recurso railway_environment del estado (si existe)
terraform state rm railway_environment.main

# O limpia todo el estado y empieza de nuevo
rm terraform.tfstate*
terraform init
```

Luego ejecuta `terraform plan` para verificar que todo esté correcto.
