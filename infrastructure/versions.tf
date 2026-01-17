terraform {
  required_version = ">= 1.0"

  required_providers {
    railway = {
      # Provider comunitario de Railway (no oficial)
      # Ver: https://github.com/terraform-community-providers/terraform-provider-railway
      source  = "terraform-community-providers/railway"
      version = "~> 0.6"
    }
  }

  # Backend HTTP remoto en Railway
  # El estado se almacena en un servicio HTTP desplegado en Railway
  # Usa un Volume persistente para almacenar el estado de forma segura
  #
  # IMPORTANTE: Estos valores son solo para desarrollo local.
  # Para producción/CI, configura backend.hcl o usa el secreto TF_BACKEND_URL en GitHub Actions
  #
  # Configuración mediante archivo backend.hcl:
  # terraform init -backend-config=backend.hcl
  #
  # El workflow de GitHub Actions crea backend.hcl automáticamente usando TF_BACKEND_URL
  backend "http" {
    # Valores por defecto (pueden ser sobrescritos con -backend-config)
    address        = "http://localhost:3000/terraform.tfstate"
    lock_address   = "http://localhost:3000/terraform.tfstate/lock"
    unlock_address = "http://localhost:3000/terraform.tfstate/lock"
    lock_method    = "POST"
    unlock_method  = "DELETE"
    retry_max      = 5
    retry_wait_min = 1
  }
}
