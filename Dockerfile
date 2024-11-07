FROM nginx:1.19.6-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY services/client/build /usr/share/nginx/html


EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
