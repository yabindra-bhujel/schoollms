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

python -m venv lms
call lms\Scripts\activate
pip install -r requirements.txt

echo Starting Django server
python manage.py runserver
