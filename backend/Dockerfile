# Uso node 20
FROM node:20-alpine

# Instala dependecias
WORKDIR /app

# Copia el codigo
COPY package*.json ./
RUN npm install

# Esto lo comento pq me esta cogiendo lo de dist en vez de lo de mi codigo real, y solo actualiza el host y las cosas que salen cuando lo reinicio
# COPY . .

# Arranca en modo dev con start:dev
CMD ["npm", "run", "start:dev"]