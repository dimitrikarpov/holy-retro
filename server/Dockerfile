FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm ci --only=production

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD [ "node", "dist/server.js" ]
