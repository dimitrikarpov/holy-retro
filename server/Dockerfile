FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm ci --only=production

RUN npm install

RUN npm run build

COPY . .

EXPOSE 1337

CMD [ "node", "dist/server.js" ]
