FROM python:3.11.0 as api

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt .
RUN pip install --no-cache-dir --index-url=https://pypi.org/simple/ -r requirements.txt

COPY . .

COPY entrypoint.sh .
RUN sed -i 's/\r$//g' entrypoint.sh

RUN chmod +x entrypoint.sh

CMD ["celery", "-A", "university", "worker", "--loglevel=info"]


ENTRYPOINT ["/app/api/entrypoint.sh"]
