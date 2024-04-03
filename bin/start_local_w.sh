@echo off


echo Processes on ports 3000 and 8000 stopped
echo Starting local development environment

cd frontend
npm install

start npm start

echo Local development environment started

cd ..

cd api


echo Creating virtual environment
# if already exists, delete it
if exist venv (
    rmdir /s /q venv
)
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo Starting Django server
python manage.py runserver
