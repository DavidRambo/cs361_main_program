"""Backend configuration for Fastapi."""

from typing import Annotated, Any, Literal
import secrets

import pydantic
import pydantic_settings


def parse_cors(val: Any) -> list[str] | str:
    if isinstance(val, str) and not val.startswith("["):  # ]  autoindent fix
        return [entry.strip() for entry in val.split(",")]
    elif isinstance(val, list | str):
        return val
    raise ValueError(val)


class Settings(pydantic_settings.BaseSettings):
    model_config = pydantic_settings.SettingsConfigDict(
        # Use .env file from project's top-level directory.
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    REGISTRATION_CODE: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    PROJECT_NAME: str

    BACKEND_CORS_ORIGIN: Annotated[
        list[pydantic.AnyUrl] | str, pydantic.BeforeValidator(parse_cors)
    ] = []

    @pydantic.computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        """Returns a list of all CORS."""
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGIN]

    FIRST_USER: str
    FIRST_USER_PASSWORD: str
    FIRST_USER_NAME: str


settings = Settings()
