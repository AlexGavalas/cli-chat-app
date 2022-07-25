FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY server.js server.js

USER node

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
