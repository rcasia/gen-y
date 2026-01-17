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
  # Configuración mediante archivo backend.hcl:
  # terraform init -backend-config=backend.hcl
  #
  # O mediante variables de entorno:
  # export TF_HTTP_ADDRESS="https://tu-backend.railway.app"
  backend "http" {
    address        = "http://localhost:3000/terraform.tfstate"
    lock_address   = "http://localhost:3000/terraform.tfstate/lock"
    unlock_address = "http://localhost:3000/terraform.tfstate/lock"
    lock_method    = "POST"
    unlock_method  = "DELETE"
    retry_max      = 5
    retry_wait_min = 1
  }
}
