FROM node:20.12-alpine as Build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM node:20.12-alpine 

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production --omit=dev
COPY --from=Build /app/dist .

EXPOSE 3000

ENTRYPOINT ["node", "./src/index.js"]

