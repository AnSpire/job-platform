from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # JWT
    PRIVATE_KEY_PATH: str
    PUBLIC_KEY_PATH: str
    ACCESS_TTL_MIN: int = 15
    REFRESH_TTL_DAYS: int = 7
    JWT_ISS: str = "job-platform-api"
    JWT_AUD: str = "job-platform-web"

    # PostgreSQL
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int

    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DB_ECHO: bool = False

    class Config:
        env_file = ".env"

settings = Settings()

PRIVATE_KEY = Path(settings.PRIVATE_KEY_PATH).read_text(encoding="utf-8")
PUBLIC_KEY  = Path(settings.PUBLIC_KEY_PATH).read_text(encoding="utf-8")
ALGO = "RS256"
