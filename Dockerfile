FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/ .

RUN npm install --production

RUN npm install @types/jest jest

EXPOSE 4000

CMD [ "node", "dist/main" ]
