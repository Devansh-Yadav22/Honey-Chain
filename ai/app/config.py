"""
Environment-driven settings for the AI service.

Mirrors the naming pattern in 00_MASTER_SPEC.md §34 (Environment Variables).
Actual values are supplied via .env / process environment — never hardcoded,
never committed.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Service identity
    SERVICE_NAME: str = "honey-chain-ai"
    ENV: str = "development"
    PORT: int = 8001

    # Reserved for later steps (e.g. dataset paths, model thresholds).
    # Keep additions here in sync with 00_MASTER_SPEC.md when they affect
    # cross-component behaviour.


settings = Settings()
