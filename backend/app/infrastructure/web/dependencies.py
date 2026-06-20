"""
Inyección de Dependencias — FastAPI
=====================================
Fábricas que instancian los casos de uso con sus dependencias reales.

Al cambiar de MySQL a otra BD, solo se modifica este archivo;
los use cases y el dominio permanecen intactos.
"""
from fastapi import Depends
from sqlalchemy.orm import Session

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.docente_repository_impl import DocenteRepositoryImpl
from app.application.use_cases.obtener_perfil_docente import ObtenerPerfilDocenteUseCase
from app.application.use_cases.actualizar_perfil_docente import ActualizarPerfilDocenteUseCase
from app.application.use_cases.obtener_historial_capacitacion import ObtenerHistorialCapacitacionUseCase
from app.application.use_cases.login_docente import LoginDocenteUseCase


# ── Factories de repositorio ───────────────────────────────────────────────────

def get_docente_repository(db: Session = Depends(get_db)) -> DocenteRepositoryImpl:
    """Crea el repositorio concreto inyectando la sesión de BD."""
    return DocenteRepositoryImpl(db)


# ── Factories de casos de uso ──────────────────────────────────────────────────

def get_obtener_perfil_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> ObtenerPerfilDocenteUseCase:
    return ObtenerPerfilDocenteUseCase(repo)


def get_actualizar_perfil_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> ActualizarPerfilDocenteUseCase:
    return ActualizarPerfilDocenteUseCase(repo)


def get_historial_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> ObtenerHistorialCapacitacionUseCase:
    return ObtenerHistorialCapacitacionUseCase(repo)


def get_login_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> LoginDocenteUseCase:
    return LoginDocenteUseCase(repo)
