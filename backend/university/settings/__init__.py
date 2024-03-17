import os
import dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_file = os.path.join(BASE_DIR, ".env")

if os.path.isfile(dotenv_file):
    dotenv.load_dotenv(dotenv_file)

is_production = os.environ.get('IS_PRODUCTION', default=False)

