"""
Casos de Uso — Módulo Proyecto Integrador
==========================================
Orquestan la lógica sin conocer FastAPI ni SQLAlchemy.
"""
from __future__ import annotations
import datetime
from typing import List, Optional

from app.domain.entities.proyecto import ProyectoIntegrador
from app.domain.ports.proyecto_repository import ProyectoRepositoryPort
from app.application.dtos.proyecto_dtos import (
    AlumnoProyectoResponse,
    CrearProyectoRequest,
    ProyectoDetalleResponse,
    ProyectoResponse,
    ActualizarCalificacionRequest,
)


# ── 1. Listar proyectos del docente ──────────────────────────────────────────

class ListarProyectosUseCase:
    def __init__(self, repo: ProyectoRepositoryPort) -> None:
        self._repo = repo

    def execute(self, docente_id: int) -> List[ProyectoResponse]:
        proyectos = self._repo.listar_por_docente(docente_id)
        return [
            ProyectoResponse(
                id=p.id,
                nombre_proyecto=p.nombre_proyecto,
                descripcion=p.descripcion,
                linea_trabajo=p.linea_trabajo,
                estatus_general=p.estatus_general,
                fecha_registro=p.fecha_registro,
                periodo_id=p.periodo_id,
                periodo_nombre=p.periodo_nombre,
            )
            for p in proyectos
        ]


# ── 2. Obtener detalle del proyecto (con alumnos) ────────────────────────────

class ObtenerProyectoDetalleUseCase:
    def __init__(self, repo: ProyectoRepositoryPort) -> None:
        self._repo = repo

    def execute(self, proyecto_id: int) -> ProyectoDetalleResponse:
        proyecto = self._repo.obtener_por_id(proyecto_id)
        if proyecto is None:
            raise ValueError(f"Proyecto con id={proyecto_id} no encontrado.")

        alumnos = self._repo.listar_alumnos(proyecto_id)
        return ProyectoDetalleResponse(
            id=proyecto.id,
            nombre_proyecto=proyecto.nombre_proyecto,
            descripcion=proyecto.descripcion,
            linea_trabajo=proyecto.linea_trabajo,
            estatus_general=proyecto.estatus_general,
            fecha_registro=proyecto.fecha_registro,
            periodo_id=proyecto.periodo_id,
            periodo_nombre=proyecto.periodo_nombre,
            alumnos=[
                AlumnoProyectoResponse(
                    alumno_id=a.alumno_id,
                    nombre=a.nombre,
                    apellidos=a.apellidos,
                    matricula=a.matricula,
                    programa_educativo=a.programa_educativo,
                    grupo=a.grupo,
                    rol_equipo=a.rol_equipo,
                    calificacion_parcial_curso=a.calificacion_parcial_curso,
                    calificacion_general_proyecto=a.calificacion_general_proyecto,
                )
                for a in alumnos
            ],
        )


# ── 3. Crear nuevo proyecto ───────────────────────────────────────────────────

class CrearProyectoUseCase:
    def __init__(self, repo: ProyectoRepositoryPort) -> None:
        self._repo = repo

    def execute(self, docente_id: int, body: CrearProyectoRequest) -> ProyectoResponse:
        nuevo = ProyectoIntegrador(
            id=0,  # lo asigna la BD
            docente_director_id=docente_id,
            periodo_id=body.periodo_id,
            nombre_proyecto=body.nombre_proyecto,
            descripcion=body.descripcion,
            linea_trabajo=body.linea_trabajo,
            estatus_general="Propuesta",
            fecha_registro=datetime.datetime.utcnow(),
        )
        guardado = self._repo.crear(nuevo)
        return ProyectoResponse(
            id=guardado.id,
            nombre_proyecto=guardado.nombre_proyecto,
            descripcion=guardado.descripcion,
            linea_trabajo=guardado.linea_trabajo,
            estatus_general=guardado.estatus_general,
            fecha_registro=guardado.fecha_registro,
            periodo_id=guardado.periodo_id,
            periodo_nombre=guardado.periodo_nombre,
        )


# ── 4. Guardar calificaciones ─────────────────────────────────────────────────

class GuardarCalificacionesUseCase:
    def __init__(self, repo: ProyectoRepositoryPort) -> None:
        self._repo = repo

    def execute(
        self,
        proyecto_id: int,
        calificaciones: List[ActualizarCalificacionRequest],
    ) -> None:
        proyecto = self._repo.obtener_por_id(proyecto_id)
        if proyecto is None:
            raise ValueError(f"Proyecto con id={proyecto_id} no encontrado.")
        for cal in calificaciones:
            self._repo.actualizar_calificaciones(
                proyecto_id=proyecto_id,
                alumno_id=cal.alumno_id,
                parcial=cal.calificacion_parcial_curso,
                general=cal.calificacion_general_proyecto,
            )
