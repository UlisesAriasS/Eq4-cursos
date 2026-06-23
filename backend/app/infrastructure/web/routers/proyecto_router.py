"""
Router FastAPI — Módulo Proyectos Integradores
================================================
Expone los endpoints REST del módulo de Proyectos.
"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dtos.proyecto_dtos import (
    ActualizarCalificacionRequest,
    CrearProyectoRequest,
    ProyectoDetalleResponse,
    ProyectoResponse,
)
from app.application.use_cases.proyecto_use_cases import (
    CrearProyectoUseCase,
    GuardarCalificacionesUseCase,
    ListarProyectosUseCase,
    ObtenerProyectoDetalleUseCase,
)
from app.infrastructure.web.dependencies import get_proyecto_repository

router = APIRouter(
    prefix="/proyectos",
    tags=["Proyectos Integradores"],
)


# ── Listar proyectos del docente ─────────────────────────────────────────────

@router.get(
    "/docente/{docente_id}",
    response_model=List[ProyectoResponse],
    summary="Listar proyectos del docente",
)
def listar_proyectos(
    docente_id: int,
    repo=Depends(get_proyecto_repository),
):
    uc = ListarProyectosUseCase(repo)
    return uc.execute(docente_id)


# ── Detalle de un proyecto ───────────────────────────────────────────────────

@router.get(
    "/{proyecto_id}",
    response_model=ProyectoDetalleResponse,
    summary="Obtener detalle del proyecto (con alumnos)",
)
def obtener_proyecto(
    proyecto_id: int,
    repo=Depends(get_proyecto_repository),
):
    try:
        uc = ObtenerProyectoDetalleUseCase(repo)
        return uc.execute(proyecto_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


# ── Crear proyecto ───────────────────────────────────────────────────────────

@router.post(
    "/docente/{docente_id}",
    response_model=ProyectoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear nuevo proyecto integrador",
)
def crear_proyecto(
    docente_id: int,
    body: CrearProyectoRequest,
    repo=Depends(get_proyecto_repository),
):
    try:
        uc = CrearProyectoUseCase(repo)
        return uc.execute(docente_id, body)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


# ── Guardar calificaciones ───────────────────────────────────────────────────

@router.patch(
    "/{proyecto_id}/calificaciones",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Guardar calificaciones de alumnos en el proyecto",
)
def guardar_calificaciones(
    proyecto_id: int,
    body: List[ActualizarCalificacionRequest],
    repo=Depends(get_proyecto_repository),
):
    try:
        uc = GuardarCalificacionesUseCase(repo)
        uc.execute(proyecto_id, body)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
