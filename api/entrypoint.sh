#!/bin/bash

if [ -d "static" ]; then
    echo "Static files already exist. Skipping collectstatic..."
else
    echo "Collecting static files..."
    python manage.py collectstatic --no-input --clear
fi

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

exec "$@"
