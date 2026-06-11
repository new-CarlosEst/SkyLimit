FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json
RUN ls -la /app/dist || echo "DIST NO EXISTE"

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main"]
