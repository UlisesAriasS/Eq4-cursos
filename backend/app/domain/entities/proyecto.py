"""
Entidades de Dominio — Módulo Proyecto Integrador
===================================================
Objetos de negocio puros. No importan frameworks ni bases de datos.
"""
from __future__ import annotations
import datetime
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ProyectoIntegrador:
    """Representa un proyecto integrador dirigido por un docente."""
    id: int
    docente_director_id: int
    periodo_id: int
    nombre_proyecto: str
    descripcion: str
    linea_trabajo: Optional[str]
    estatus_general: str   # 'Propuesta' | 'Aprobado' | 'En Desarrollo' | 'Finalizado' | 'Cancelado'
    fecha_registro: datetime.datetime

    # Datos del período (se pueblan al hacer el join)
    periodo_nombre: Optional[str] = None


@dataclass
class AlumnoProyecto:
    """Alumno inscrito en un proyecto con sus calificaciones."""
    proyecto_id: int
    alumno_id: int
    nombre: str
    apellidos: str
    matricula: str
    programa_educativo: Optional[str]
    grupo: str
    rol_equipo: Optional[str]
    calificacion_parcial_curso: Optional[float]
    calificacion_general_proyecto: Optional[float]
