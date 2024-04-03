@echo off
echo Stopping processes on ports 3000 and 8000

:kill_processes_on_port
set "port=%~1"
echo Killing processes on port %port%
for /f "tokens=2" %%a in ('netstat -aon ^| findstr /r /c:"%port%"') do (
    taskkill /f /pid %%a
)

echo Processes on ports 3000 and 8000 stopped
echo Starting local development environment

cd frontend
npm install

start npm start

echo Local development environment started

cd ..

cd api

if exist "venv" (
    echo Activating existing virtual environment
    call venv\Scripts\activate
) else (
    echo Creating virtual environment
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
)

echo Starting Django server
python manage.py runserver
