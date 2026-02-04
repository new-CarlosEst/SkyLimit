# Uso node 20
FROM node:20-alpine

# Instala dependecias
WORKDIR /app

# Copia el codigo
COPY package*.json ./
RUN npm install

COPY . .

# Arranca en modo dev con start:dev
CMD ["npm", "run", "start:dev"]