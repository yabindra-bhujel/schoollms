# Dockerfile

FROM python:3.11.0 as api

# 環境変数の設定
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリの設定
WORKDIR /srv/app

# システム依存関係をインストール
RUN apt-get update \

    && apt-get install -y \
    --no-install-recommends curl \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# 依存関係ファイルをコピー
COPY pyproject.toml /srv/app/

# Poetryのインストール
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry  # シンボリックリンクを作成

# Poetryの設定と依存関係のインストール
RUN poetry install --no-dev \
    && poetry run gunicorn --version



COPY ./bin /srv/app/bin

RUN chmod 755 /srv/app/bin/*



RUN mkdir -p /var/log/django_services/supervisor

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV DJANGO_SETTINGS_MODULE=config.settings.prod


COPY . /srv/app

# ポートの設定
ENV PORT 8000
EXPOSE 8000