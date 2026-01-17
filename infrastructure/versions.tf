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

  # Backend configuration (opcional)
  # Para producción, considera usar Terraform Cloud o S3
  # backend "remote" {
  #   organization = "tu-organizacion"
  #   workspaces {
  #     name = "geny-market"
  #   }
  # }
}
