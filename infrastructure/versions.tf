terraform {
  required_version = ">= 1.0"

  required_providers {
    railway = {
      # Provider comunitario de Railway (no oficial)
      # Ver: https://github.com/terraform-community-providers/terraform-provider-railway
      source  = "terraform-community-providers/railway"
      version = "~> 0.6"
    }
    aws = {
      # Provider AWS para el backend S3 (compatible con MinIO)
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend S3 usando MinIO en Railway
  # IMPORTANTE: Para el primer deployment, estos valores son placeholders
  # Después del primer deployment, configura backend.hcl con la URL real de MinIO
  #
  # Configuración mediante archivo backend.hcl:
  # terraform init -backend-config=backend.hcl
  #
  # O mediante variables de entorno:
  # export AWS_ACCESS_KEY_ID="minioadmin"
  # export AWS_SECRET_ACCESS_KEY="minioadmin"
  # export AWS_ENDPOINT="https://tu-minio.railway.app"
  backend "s3" {
    # Estos valores se pueden sobrescribir con -backend-config=backend.hcl
    bucket                      = "terraform-state"
    key                         = "terraform.tfstate"
    region                      = "us-east-1"
    endpoint                    = "http://localhost:9000"
    access_key                  = "minioadmin"
    secret_key                  = "minioadmin"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation     = true
    force_path_style            = true
  }
}
