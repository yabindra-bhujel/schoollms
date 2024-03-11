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
npm start &
echo "Local development environment started"



cd ../backend
source venv/bin/activate
python3 manage.py runserver &
celery -A university worker -l info
celery -A university beat -l info


