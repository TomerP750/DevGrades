

FROM node:20-alpine

WORKDIR /app

EXPOSE 5173

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]