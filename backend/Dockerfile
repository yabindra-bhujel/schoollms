FROM python:3.11.0

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir --index-url=https://pypi.org/simple/ -r requirements.txt

COPY . .

# Migrate the database
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate --no-input

# Collect static files
RUN python3 manage.py collectstatic --no-input

