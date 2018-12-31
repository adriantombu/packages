FROM node:carbon-alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN yarn install

COPY ./ ./

CMD ["yarn", "build"]
