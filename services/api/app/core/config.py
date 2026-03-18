from functools import lru_cache

from pydantic import computed_field
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
    enable_internal_routes: bool | None = None
    enable_runtime_bootstrap: bool | None = None
    seed_dev_data: bool | None = None

    @computed_field(return_type=bool)
    @property
    def is_local_dev(self) -> bool:
        return self.app_env.lower() in {"development", "local", "dev"}

    @computed_field(return_type=bool)
    @property
    def internal_routes_enabled(self) -> bool:
        if self.enable_internal_routes is not None:
            return self.enable_internal_routes
        return self.is_local_dev

    @computed_field(return_type=bool)
    @property
    def runtime_bootstrap_enabled(self) -> bool:
        if self.enable_runtime_bootstrap is not None:
            return self.enable_runtime_bootstrap
        return self.is_local_dev

    @computed_field(return_type=bool)
    @property
    def dev_data_seeding_enabled(self) -> bool:
        if self.seed_dev_data is not None:
            return self.seed_dev_data
        return self.is_local_dev


@lru_cache
def get_settings() -> Settings:
    return Settings()
