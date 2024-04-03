FROM python:3.11.0 as api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir --index-url=https://pypi.org/simple/ -r requirements.txt

COPY . .

# Collect static files
RUN python manage.py collectstatic --no-input --clear
