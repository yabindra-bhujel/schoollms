# Use the Python 3.11.0 base image
FROM python:3.11.0 as api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo \
    && rm -rf /var/lib/apt/lists/*

# Create and switch to a new user
# RUN adduser --disabled-password --no-create-home django-api \
#     && chown -R django-api /app

# USER django-api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT ["/app/api/entrypoint.sh"]
