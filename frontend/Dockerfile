# Uso node 20
FROM node:20-alpine

# Instalo dependencias
WORKDIR /app

# Copio el codigo
COPY package*.json ./
RUN npm install

# Lo comento para que vaya todo y no copie tal cual de los datos pq entonces solo ejecutaria el codigo estatico de dist (en caso de tener uno)
# COPY . .

# Ejecuto el el proyecto de vite
CMD ["npm", "run", "dev", "--", "--host"]