# Notas sobre el Provider de Railway para Terraform

## ⚠️ Importante

Railway **no tiene un provider oficial de Terraform** completamente soportado. Hay algunas opciones:

### Opción 1: Provider Comunitario

Si el provider `railwayapp/railway` no está disponible, puedes usar el provider comunitario:

```hcl
terraform {
  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "~> 0.1"
    }
  }
}
```

### Opción 2: Railway CLI + Scripts

Como alternativa, puedes usar Railway CLI con scripts de automatización:

```bash
# Crear proyecto
railway init

# Configurar variables
railway variables set NODE_ENV=production

# Desplegar
railway up
```

### Opción 3: Railway API Directa

Puedes usar la API de Railway directamente con `curl` o scripts en bash/Python.

## 🔧 Configuración Actual

La configuración actual en `versions.tf` usa `railwayapp/railway`. Si este provider no funciona:

1. Cambia el source en `versions.tf` al provider comunitario
2. O usa Railway CLI directamente (ver `README.md`)

## 📚 Recursos

- [Railway API Docs](https://docs.railway.app/reference/api)
- [Terraform Community Providers](https://github.com/terraform-community-providers)
- [Railway CLI](https://docs.railway.app/develop/cli)
