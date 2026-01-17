FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copiar código
COPY . .

# El estado se almacenará en /app/state (montado como Volume en Railway)
RUN mkdir -p /app/state

EXPOSE 3000

CMD ["node", "server.js"]
