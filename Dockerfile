FROM node:14

WORKDIR /app
COPY . .

ENV ENV=prod
RUN yarn && yarn build
EXPOSE 3000
CMD ["node", "staticServer/index.js"]
