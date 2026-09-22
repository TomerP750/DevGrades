FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]