FROM node:alpine as build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app/client


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build





FROM nginx:1.18.0-alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY ./default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/client/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
