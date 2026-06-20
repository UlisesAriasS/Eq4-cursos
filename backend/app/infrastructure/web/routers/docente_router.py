"""
Router FastAPI — Módulo Docentes
==================================
Adaptador primario (Web/Driving Adapter).
Expone los 3 endpoints REST del módulo de Perfil Académico.

Los endpoints reciben HTTP y delegan al caso de uso correspondiente.
No contienen lógica de negocio.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dtos.docente_dtos import (
    ActualizarPerfilRequest,
    HistorialCapacitacionResponse,
    PerfilDocenteResponse,
)
from app.application.use_cases.actualizar_perfil_docente import ActualizarPerfilDocenteUseCase
from app.application.use_cases.obtener_historial_capacitacion import ObtenerHistorialCapacitacionUseCase
from app.application.use_cases.obtener_perfil_docente import ObtenerPerfilDocenteUseCase
from app.infrastructure.web.dependencies import (
    get_actualizar_perfil_use_case,
    get_historial_use_case,
    get_obtener_perfil_use_case,
)

router = APIRouter(
    prefix="/docentes",
    tags=["Perfil Académico de Docentes"],
)


@router.get(
    "/{usuario_id}/perfil",
    response_model=PerfilDocenteResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener perfil académico del docente",
    description=(
        "Recupera la información básica del docente (nombre, apellidos, "
        "número de empleado, grado académico, categoría) y su cuenta de usuario vinculada."
    ),
)
def obtener_perfil(
    usuario_id: int,
    use_case: ObtenerPerfilDocenteUseCase = Depends(get_obtener_perfil_use_case),
) -> PerfilDocenteResponse:
    try:
        return use_case.execute(usuario_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{usuario_id}/perfil",
    response_model=PerfilDocenteResponse,
    status_code=status.HTTP_200_OK,
    summary="Actualizar perfil académico del docente",
    description=(
        "Permite al docente actualizar su grado académico, adscripción y/o categoría. "
        "Solo se modifican los campos enviados en el body (PATCH semántico)."
    ),
)
def actualizar_perfil(
    usuario_id: int,
    body: ActualizarPerfilRequest,
    use_case: ActualizarPerfilDocenteUseCase = Depends(get_actualizar_perfil_use_case),
) -> PerfilDocenteResponse:
    try:
        return use_case.execute(usuario_id, body)
    except ValueError as exc:
        # Distinguir "no encontrado" de "cuenta inactiva"
        detail = str(exc)
        code = (
            status.HTTP_403_FORBIDDEN
            if "inactiva" in detail
            else status.HTTP_404_NOT_FOUND
        )
        raise HTTPException(status_code=code, detail=detail) from exc


@router.get(
    "/{usuario_id}/historial-capacitacion",
    response_model=HistorialCapacitacionResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener historial de capacitación del docente",
    description=(
        "Lista todos los cursos y certificaciones que el docente ha completado "
        "o en los que está inscrito, ordenados por fecha de conclusión descendente."
    ),
)
def obtener_historial(
    usuario_id: int,
    use_case: ObtenerHistorialCapacitacionUseCase = Depends(get_historial_use_case),
) -> HistorialCapacitacionResponse:
    try:
        return use_case.execute(usuario_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
