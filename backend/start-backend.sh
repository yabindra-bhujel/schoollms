#!/bin/bash

# Run the Docker Compose file to start the services defined there
# backend start-backend.sh
docker-compose up -d --build


if [[ "$(docker-compose ps -q db)" ]]; then
  echo "Waiting for database..."
fi

docker exec -i django_backend python manage.py migrate








