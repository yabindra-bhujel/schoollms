# Use the base Python image
FROM python:3.11.0 as api

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app/api

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --index-url=https://pypi.org/simple/ -r requirements.txt

# Copy the entire Django project into the container
COPY . .

# Download wait-for-it.sh script from GitHub
RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

# Set the entrypoint of the container
CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh database:5432 -- python manage.py runserver 0.0.0.0:8000"]
