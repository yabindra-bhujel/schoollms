#!/bin/bash
echo "Stopping processes on ports 3000 and 8000"

kill_processes_on_port() {
    port=$1
    echo "Killing processes on port $port"
    pid=$(lsof -t -i:$port)
    if [ -n "$pid" ]; then
        kill -9 $pid
    fi
}
kill_processes_on_port 3000
kill_processes_on_port 8000
kill_processes_on_port 3001

echo "Processes on ports 3000 and 8000 stopped"
echo "Starting local development environment"

cd frontend
npm install

npm start &

echo "Local development environment started"

cd ../api

if [ -d "venv" ]; then
    echo "Activating existing virtual environment"
    source venv/bin/activate
else
    echo "Creating virtual environment"
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

echo "Starting Django server"
python3 manage.py runserver


