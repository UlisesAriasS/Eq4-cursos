"""
Configuración de la base de datos
===================================
Motor SQLAlchemy + fábrica de sesiones + settings desde .env
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


class Settings(BaseSettings):
    """Lee variables de entorno desde .env automáticamente."""
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "eq4user"
    DB_PASSWORD: str = "eq4password"
    DB_NAME: str = "eq4cursos"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    # Configuración del servidor
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    APP_ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            f"?charset=utf8mb4"
        )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()

# ── Motor SQLAlchemy ───────────────────────────────────────────────────────────
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,          # Verifica conexión antes de usarla
    pool_recycle=3600,           # Recicla conexiones cada hora
    echo=False,                  # Cambiar a True para ver SQL en consola
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ── Base declarativa para los modelos ORM ─────────────────────────────────────
class Base(DeclarativeBase):
    pass


def get_db():
    """
    Generador de sesión para inyección de dependencias en FastAPI.
    Garantiza cierre de sesión incluso si ocurre una excepción.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
