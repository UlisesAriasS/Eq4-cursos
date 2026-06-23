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
from app.infrastructure.database.proyecto_repository_impl import ProyectoRepositoryImpl
from app.application.use_cases.obtener_perfil_docente import ObtenerPerfilDocenteUseCase
from app.application.use_cases.actualizar_perfil_docente import ActualizarPerfilDocenteUseCase
from app.application.use_cases.obtener_historial_capacitacion import ObtenerHistorialCapacitacionUseCase
from app.application.use_cases.login_docente import LoginDocenteUseCase
from app.application.use_cases.obtener_documentos_historicos import ObtenerDocumentosHistoricosUseCase
from app.application.use_cases.agregar_documento_historico import AgregarDocumentoHistoricoUseCase
from app.application.use_cases.eliminar_documento_historico import EliminarDocumentoHistoricoUseCase


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


def get_obtener_documentos_historicos_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> ObtenerDocumentosHistoricosUseCase:
    return ObtenerDocumentosHistoricosUseCase(repo)


def get_agregar_documento_historico_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> AgregarDocumentoHistoricoUseCase:
    return AgregarDocumentoHistoricoUseCase(repo)

def get_eliminar_documento_historico_use_case(
    repo: DocenteRepositoryImpl = Depends(get_docente_repository),
) -> EliminarDocumentoHistoricoUseCase:
    return EliminarDocumentoHistoricoUseCase(repo)


def get_proyecto_repository(db: Session = Depends(get_db)) -> ProyectoRepositoryImpl:
    """Crea el repositorio de proyectos inyectando la sesión de BD."""
    return ProyectoRepositoryImpl(db)
