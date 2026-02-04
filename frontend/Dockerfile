# Uso node 20
FROM node:20-alpine

# Instalo dependencias
WORKDIR /app

# Copio el codigo
COPY package*.json ./
RUN npm install

COPY . .

# Ejecuto el el proyecto de vite
CMD ["npm", "run", "dev", "--", "--host"]