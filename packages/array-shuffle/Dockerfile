FROM node:carbon-alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN yarn install

COPY ./ ./

EXPOSE 1338
CMD ["yarn", "build"]
