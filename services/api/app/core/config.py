from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "D-ARCHIE API"
    app_env: str = "development"
    database_url: str = "postgresql://postgres:postgres@postgres:5432/darchie"
    redis_url: str = "redis://redis:6379/0"
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000


@lru_cache
def get_settings() -> Settings:
    return Settings()
