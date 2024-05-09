#!/bin/bash

set -e

python manage.py collectstatic --no-input --clear

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi


# migrate databse
python3 manage.py migrate --noinput

gunicorn config.wsgi:application --bind 0.0.0.0:8000


exec "$@"
