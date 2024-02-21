#!/bin/bash

echo "Starting local development environment"

# Navigate to the backend directory and activate the virtual environment
cd backend
source venv/bin/activate

# Apply database migrations and start the Django server in the background
python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver &

# Navigate to the frontend directory and start the React server in the background
cd ../frontend
npm start &

echo "Local development environment started"
