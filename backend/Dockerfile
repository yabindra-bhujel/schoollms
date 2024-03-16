FROM python:3.11.0 as api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir --index-url=https://pypi.org/simple/ -r requirements.txt

COPY . .

RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh database:5432 -- python manage.py runserver 0.0.0.0:8000"]
