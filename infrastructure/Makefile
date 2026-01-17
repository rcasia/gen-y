.PHONY: init plan apply destroy output validate fmt

# Variables
TF_DIR = .
TF_VAR_FILE = terraform.tfvars

# Inicializar Terraform
init:
	@echo "🔧 Inicializando Terraform..."
	terraform init

# Validar configuración
validate:
	@echo "✅ Validando configuración de Terraform..."
	terraform validate

# Formatear código
fmt:
	@echo "📝 Formateando archivos Terraform..."
	terraform fmt -recursive

# Planificar cambios
plan:
	@echo "📋 Planificando cambios..."
	terraform plan -var-file=$(TF_VAR_FILE)

# Aplicar cambios
apply:
	@echo "🚀 Aplicando cambios..."
	terraform apply -var-file=$(TF_VAR_FILE) -auto-approve

# Aplicar con confirmación
apply-interactive:
	@echo "🚀 Aplicando cambios (con confirmación)..."
	terraform apply -var-file=$(TF_VAR_FILE)

# Destruir infraestructura
destroy:
	@echo "🗑️  Destruyendo infraestructura..."
	terraform destroy -var-file=$(TF_VAR_FILE) -auto-approve

# Mostrar outputs
output:
	@echo "📤 Outputs de Terraform:"
	terraform output

# Mostrar estado
show:
	@echo "📊 Estado actual:"
	terraform show

# Limpiar archivos temporales
clean:
	@echo "🧹 Limpiando archivos temporales..."
	rm -rf .terraform
	rm -f .terraform.lock.hcl
	rm -f terraform.tfstate terraform.tfstate.backup

# Setup completo
setup: init validate fmt
	@echo "✅ Setup completado"

# Help
help:
	@echo "Comandos disponibles:"
	@echo "  make init              - Inicializar Terraform"
	@echo "  make validate          - Validar configuración"
	@echo "  make fmt               - Formatear código"
	@echo "  make plan              - Planificar cambios"
	@echo "  make apply             - Aplicar cambios (sin confirmación)"
	@echo "  make apply-interactive - Aplicar cambios (con confirmación)"
	@echo "  make destroy           - Destruir infraestructura"
	@echo "  make output            - Mostrar outputs"
	@echo "  make show              - Mostrar estado"
	@echo "  make clean             - Limpiar archivos temporales"
	@echo "  make setup             - Setup completo (init + validate + fmt)"
