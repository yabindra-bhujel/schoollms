#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import dotenv
import django

def main():
    """Run administrative tasks."""

    dotenv_file = os.path.join(".env")
    if os.path.isfile(dotenv_file):
        dotenv.load_dotenv(dotenv_file)

    # 環境に応じた設定モジュールの選択
    isDev = os.environ.get('DEVELOPMENT_MODE') == 'True'
    if isDev:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')

    # Djangoの初期化
    django.setup()

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
