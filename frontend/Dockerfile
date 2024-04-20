FROM node:alpine as build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app/client


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*


COPY --from=build /app/client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]