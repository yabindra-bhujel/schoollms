#!/bin/bash

echo "Cleaning up the old migrations"

# dump data
python3 manage.py dumpdata --exclude=contenttypes > db.json


# clean database
python3 manage.py sqlflush | python3 manage.py dbshell

# migrate
python3 manage.py makemigrations

# migrate
python3 manage.py migrate

# load data

python3 manage.py loaddata db.json


echo "Migrations complete....."








