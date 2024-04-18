# Use the Python 3.11.0 base image
FROM python:3.11.0 as api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password --no-create-home django-api

USER django-api

COPY . .

USER root

COPY entrypoint.sh .
RUN sed -i 's/\r$//g' entrypoint.sh && \
    chmod +x entrypoint.sh

USER django-api

ENTRYPOINT ["/app/api/entrypoint.sh"]
