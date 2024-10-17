# Use the lightweight Alpine-based Nginx image
FROM nginx:1.19.6-alpine

# Copy the custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY services/client/build /usr/share/nginx/html





# Expose port 80 to make the server accessible
EXPOSE 80

# Run Nginx in the foreground (non-daemon mode)
CMD ["nginx", "-g", "daemon off;"]
