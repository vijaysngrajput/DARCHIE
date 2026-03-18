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
    auth_token_issuer: str = "d-archie-local"
    auth_token_audience: str = "d-archie-clients"
    event_transport_mode: str = "in_memory"
    enable_internal_routes: bool = True
    enable_runtime_bootstrap: bool = True
    seed_dev_data: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
