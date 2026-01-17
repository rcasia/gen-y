# GitHub Actions Workflows

Esta carpeta contiene los workflows de GitHub Actions para automatizar CI/CD.

## Workflows Disponibles

### 1. `deploy.yml` - Despliegue con Terraform (Recomendado)

Despliega la aplicación en Railway usando Terraform como IaC.

**Características:**
- ✅ Build de la aplicación
- ✅ Validación con Terraform
- ✅ Despliegue automático en `main`/`master`
- ✅ Plan en PRs (sin aplicar)

**Secrets requeridos:**
- `RAILWAY_TOKEN`: Token de API de Railway

**Cuándo se ejecuta:**
- Push a `main` o `master` → Despliega
- Pull Request → Solo plan (no despliega)
- Manualmente desde Actions tab

### 2. `ci.yml` - Continuous Integration

Ejecuta tests, linting y build en cada push/PR.

**Características:**
- ✅ Linting
- ✅ Build verification
- ✅ No despliega

**Cuándo se ejecuta:**
- Push a cualquier rama
- Pull Request

## 🔐 Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Añade los siguientes secrets:

### Para Terraform (deploy.yml):
- `RAILWAY_TOKEN`: Tu token de Railway API
  - Obtener en: https://railway.app/account/tokens

## 🚀 Uso

### Despliegue Automático

Simplemente haz push a `main` o `master`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

El workflow se ejecutará automáticamente.

### Despliegue Manual

1. Ve a la pestaña "Actions" en GitHub
2. Selecciona el workflow "Deploy to Railway"
3. Click en "Run workflow"
4. Selecciona la rama y ejecuta

## 📊 Monitoreo

- Ve el estado de los despliegues en la pestaña "Actions"
- Los logs muestran el progreso del build y deploy
- Terraform mostrará los cambios planificados antes de aplicar

## 🔧 Personalización

Puedes modificar los workflows para:
- Cambiar la rama de despliegue
- Añadir tests antes del deploy
- Configurar diferentes ambientes (staging/production)
- Añadir notificaciones (Slack, Discord, etc.)

## ⚠️ Notas

- El workflow de Terraform solo aplica cambios en `main`/`master`
- En PRs, solo se ejecuta `terraform plan` (no aplica cambios)
- Asegúrate de tener los secrets configurados antes del primer despliegue
