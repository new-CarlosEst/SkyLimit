FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx @nestjs/cli build
RUN ls -la /app/dist || echo "DIST NO EXISTE"

CMD ["node", "dist/main"]
