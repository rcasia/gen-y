provider "railway" {
  # Railway provider usa el token de la variable de entorno RAILWAY_TOKEN
  # O puedes configurarlo aquí directamente (no recomendado para producción)
  token = var.railway_token
}
