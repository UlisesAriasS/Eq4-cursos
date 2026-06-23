"""
Adaptador de Base de Datos: ProyectoRepositoryImpl
===================================================
Implementación concreta del puerto usando SQLAlchemy.
"""
from __future__ import annotations
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.domain.entities.proyecto import AlumnoProyecto, ProyectoIntegrador
from app.domain.ports.proyecto_repository import ProyectoRepositoryPort
from app.infrastructure.database.models import (
    AlumnoORM,
    PeriodoAcademicoORM,
    ProyectoAlumnoORM,
    ProyectoIntegradorORM,
)


class ProyectoRepositoryImpl(ProyectoRepositoryPort):

    def __init__(self, db: Session) -> None:
        self._db = db

    # ── Mapper ──────────────────────────────────────────────────────────────────

    @staticmethod
    def _to_entity(orm: ProyectoIntegradorORM) -> ProyectoIntegrador:
        return ProyectoIntegrador(
            id=orm.id,
            docente_director_id=orm.docente_director_id,
            periodo_id=orm.periodo_id,
            nombre_proyecto=orm.nombre_proyecto,
            descripcion=orm.descripcion,
            linea_trabajo=orm.linea_trabajo,
            estatus_general=orm.estatus_general,
            fecha_registro=orm.fecha_registro,
            periodo_nombre=orm.periodo.nombre if orm.periodo else None,
        )

    # ── Puerto ──────────────────────────────────────────────────────────────────

    def listar_por_docente(self, docente_id: int) -> List[ProyectoIntegrador]:
        rows = (
            self._db.query(ProyectoIntegradorORM)
            .options(joinedload(ProyectoIntegradorORM.periodo))
            .filter(ProyectoIntegradorORM.docente_director_id == docente_id)
            .order_by(ProyectoIntegradorORM.fecha_registro.desc())
            .all()
        )
        return [self._to_entity(r) for r in rows]

    def obtener_por_id(self, proyecto_id: int) -> Optional[ProyectoIntegrador]:
        row = (
            self._db.query(ProyectoIntegradorORM)
            .options(joinedload(ProyectoIntegradorORM.periodo))
            .filter(ProyectoIntegradorORM.id == proyecto_id)
            .first()
        )
        return self._to_entity(row) if row else None

    def crear(self, proyecto: ProyectoIntegrador) -> ProyectoIntegrador:
        orm = ProyectoIntegradorORM(
            docente_director_id=proyecto.docente_director_id,
            periodo_id=proyecto.periodo_id,
            nombre_proyecto=proyecto.nombre_proyecto,
            descripcion=proyecto.descripcion,
            linea_trabajo=proyecto.linea_trabajo,
            estatus_general=proyecto.estatus_general,
            fecha_registro=proyecto.fecha_registro,
        )
        self._db.add(orm)
        self._db.commit()
        self._db.refresh(orm)
        # Cargar periodo para el mapper
        self._db.query(PeriodoAcademicoORM).filter(
            PeriodoAcademicoORM.id == orm.periodo_id
        ).first()
        return self._to_entity(orm)

    def listar_alumnos(self, proyecto_id: int) -> List[AlumnoProyecto]:
        rows = (
            self._db.query(ProyectoAlumnoORM)
            .options(joinedload(ProyectoAlumnoORM.alumno))
            .filter(ProyectoAlumnoORM.proyecto_id == proyecto_id)
            .all()
        )
        return [
            AlumnoProyecto(
                proyecto_id=r.proyecto_id,
                alumno_id=r.alumno_id,
                nombre=r.alumno.nombre,
                apellidos=r.alumno.apellidos,
                matricula=r.alumno.matricula,
                programa_educativo=r.alumno.programa_educativo,
                grupo=r.alumno.grupo,
                rol_equipo=r.rol_equipo,
                calificacion_parcial_curso=float(r.calificacion_parcial_curso) if r.calificacion_parcial_curso is not None else None,
                calificacion_general_proyecto=float(r.calificacion_general_proyecto) if r.calificacion_general_proyecto is not None else None,
            )
            for r in rows
        ]

    def actualizar_calificaciones(
        self,
        proyecto_id: int,
        alumno_id: int,
        parcial: Optional[float],
        general: Optional[float],
    ) -> None:
        row = (
            self._db.query(ProyectoAlumnoORM)
            .filter(
                ProyectoAlumnoORM.proyecto_id == proyecto_id,
                ProyectoAlumnoORM.alumno_id == alumno_id,
            )
            .first()
        )
        if row:
            row.calificacion_parcial_curso = parcial
            row.calificacion_general_proyecto = general
            self._db.commit()
