FROM node:latest

LABEL maintainer="remisa.yousefvand@gmail.com"

RUN mkdir -p /usr/src/virto-bot/logs
COPY ./lib /usr/src/virto-bot/lib
COPY ./utils /usr/src/virto-bot/utils
COPY ./config /usr/src/virto-bot/config
COPY index.js /usr/src/virto-bot
COPY package*.json /usr/src/virto-bot/
WORKDIR /usr/src/virto-bot
RUN npm i --production
CMD [ "node", "index.js" ]
