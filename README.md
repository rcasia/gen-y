# 🛍️ GenY Market

Aplicación de compra y venta de productos (CDs, tocadiscos, mangas, juegos y más) con estilo futurista neon.

## ✨ Características

- 🛒 **Compra y Venta**: Navega por productos y publica los tuyos
- 📸 **Cámara Integrada**: Toma fotos de tus productos directamente desde la app
- 🎮 **Juegos Online**: Arcade con minijuegos neon
- 🎨 **Diseño Futurista**: UI con colores neon y efectos visuales
- 📦 **Gestión de Carrito**: Añade productos y gestiona tu carrito
- 🚚 **Opciones de Entrega**: Envío o punto de encuentro

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Build para producción
pnpm run build

# Preview de producción
pnpm run preview
```

## 🐳 Docker

### Construir imagen

```bash
# Desde la raíz del proyecto
docker build -f infrastructure/Dockerfile -t geny-market:latest .

# O usar el script de ayuda
./infrastructure/build.sh
```

### Ejecutar contenedor

```bash
docker run -p 3000:80 geny-market:latest
```

O usando docker-compose:

```bash
docker-compose -f infrastructure/docker-compose.yml up
```

## 🚂 Despliegue en Railway con Terraform

Toda la infraestructura está en la carpeta `infrastructure/` y usa Terraform como IaC.

### Prerrequisitos

1. **Terraform** instalado (>= 1.0)
2. **Railway API Token** desde [railway.app/account/tokens](https://railway.app/account/tokens)

### Configuración Rápida

```bash
cd infrastructure

# 1. Copiar y configurar variables
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con tus valores

# 2. Inicializar Terraform
terraform init

# 3. Planificar cambios
terraform plan

# 4. Aplicar cambios
terraform apply
```

### Usando Make (recomendado)

```bash
cd infrastructure

# Setup completo
make setup

# Planificar
make plan

# Aplicar
make apply

# Ver outputs (URLs)
make output
```

### Alternativa: Railway CLI

Si Terraform no está disponible, puedes usar Railway CLI:

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Iniciar sesión
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

Para más detalles, ver [infrastructure/README.md](infrastructure/README.md)

## 📁 Estructura del Proyecto

```
genY/
├── src/
│   ├── components/      # Componentes React
│   ├── context/         # Context API para estado global
│   └── ...
├── infrastructure/      # Infraestructura como código (Terraform)
│   ├── main.tf         # Recursos principales de Railway
│   ├── variables.tf    # Variables de configuración
│   ├── outputs.tf      # Outputs de Terraform
│   ├── provider.tf     # Provider de Railway
│   ├── versions.tf     # Versiones de Terraform
│   ├── Dockerfile      # Dockerfile para producción
│   ├── nginx.conf      # Configuración de nginx
│   ├── docker-compose.yml  # Para pruebas locales
│   ├── Makefile        # Comandos de ayuda
│   └── README.md       # Documentación de infraestructura
└── vite.config.js      # Configuración de Vite
```

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Docker** - Containerización
- **Nginx** - Servidor web para producción
- **Terraform** - Infraestructura como código
- **Railway** - Plataforma de despliegue

## 📝 Scripts Disponibles

- `pnpm run dev` - Inicia servidor de desarrollo
- `pnpm run build` - Construye para producción
- `pnpm run preview` - Preview de build de producción
- `pnpm run lint` - Ejecuta ESLint

## 🔧 Configuración

La aplicación usa localStorage para persistir datos localmente. En producción, considera usar una base de datos real.

## 📄 Licencia

Este proyecto es de código abierto.
