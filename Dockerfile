FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --production

EXPOSE 4000

CMD [ "node", "dist/main" ]
