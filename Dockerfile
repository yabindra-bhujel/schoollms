FROM nginx:1.19.6-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY services/client/build /usr/share/nginx/html

# Copy SSL certificates into the container
RUN mkdir -p /etc/nginx/ssl
COPY origin.pem /etc/nginx/ssl/origin.pem
COPY origin-key.key /etc/nginx/ssl/origin.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
