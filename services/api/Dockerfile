# Dockerfile

FROM python:3.11.0 as api

# 環境変数の設定
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリの設定
WORKDIR /srv/app

# システム依存関係をインストール
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# 依存関係ファイルをコピー
COPY pyproject.toml /srv/app/

# Poetryのインストール
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry  # シンボリックリンクを作成

# Poetryの設定と依存関係のインストール
RUN poetry install --no-dev \
    && poetry run gunicorn --version  # gunicornのバージョンを確認



COPY ./bin /srv/app/bin

RUN chmod 755 /srv/app/bin/*


# アプリケーションコードをコピー
COPY . /srv/app

# ポートの設定
ENV PORT 8000
EXPOSE 8000

# アプリケーションの起動
CMD ["poetry", "run", "gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
