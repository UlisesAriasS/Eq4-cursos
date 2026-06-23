"""
DTOs (Data Transfer Objects) — Módulo Proyecto Integrador
==========================================================
Schemas Pydantic que definen el contrato de la API REST.
"""
from __future__ import annotations
import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ─── Requests ─────────────────────────────────────────────────────────────────

class CrearProyectoRequest(BaseModel):
    nombre_proyecto: str = Field(..., max_length=255, examples=["Sistema de Gestión Hospitalaria"])
    descripcion: str     = Field(..., examples=["Desarrollo de un sistema web con módulo de IA"])
    linea_trabajo: Optional[str] = Field(default=None, max_length=150, examples=["Ingeniería de Software"])
    periodo_id: int      = Field(..., examples=[1])


class ActualizarCalificacionRequest(BaseModel):
    alumno_id: int
    calificacion_parcial_curso: Optional[float] = Field(default=None, ge=0, le=10)
    calificacion_general_proyecto: Optional[float] = Field(default=None, ge=0, le=10)


# ─── Responses ────────────────────────────────────────────────────────────────

class ProyectoResponse(BaseModel):
    id: int
    nombre_proyecto: str
    descripcion: str
    linea_trabajo: Optional[str] = None
    estatus_general: str
    fecha_registro: datetime.datetime
    periodo_id: int
    periodo_nombre: Optional[str] = None

    model_config = {"from_attributes": True}


class AlumnoProyectoResponse(BaseModel):
    alumno_id: int
    nombre: str
    apellidos: str
    matricula: str
    programa_educativo: Optional[str] = None
    grupo: str
    rol_equipo: Optional[str] = None
    calificacion_parcial_curso: Optional[float] = None
    calificacion_general_proyecto: Optional[float] = None

    model_config = {"from_attributes": True}


class ProyectoDetalleResponse(ProyectoResponse):
    alumnos: List[AlumnoProyectoResponse] = []
