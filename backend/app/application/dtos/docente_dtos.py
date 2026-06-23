"""
DTOs (Data Transfer Objects) del módulo Docente
================================================
Schemas Pydantic para validar y serializar datos entre la capa Web
y la capa de Aplicación.

Estos objetos NO son entidades de dominio; son contratos de la API.
"""
from __future__ import annotations

import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ─── Respuestas ────────────────────────────────────────────────────────────────

class UsuarioResponse(BaseModel):
    id: int
    correo: str
    rol_id: int
    activo: bool

    model_config = {"from_attributes": True}


class PerfilDocenteResponse(BaseModel):
    """Respuesta del caso de uso ObtenerPerfilDocente."""
    id: int
    usuario_id: int
    numero_empleado: str
    nombre: str
    apellidos: str
    nombre_completo: str
    telefono: Optional[str] = None
    categoria: Optional[str] = None
    adscripcion: Optional[str] = None
    grado_academico: Optional[str] = None
    es_ptc: bool
    usuario: UsuarioResponse

    model_config = {"from_attributes": True}


class HistorialCapacitacionItemResponse(BaseModel):
    """Un ítem del historial de capacitación."""
    id: int
    curso_id: int
    nombre_curso: str
    tipo_curso: str
    horas: int
    estatus: str
    fecha_conclusion: Optional[datetime.date] = None

    model_config = {"from_attributes": True}


class HistorialCapacitacionResponse(BaseModel):
    """Respuesta del caso de uso ObtenerHistorialCapacitacion."""
    usuario_id: int
    total: int
    registros: list[HistorialCapacitacionItemResponse]


# ─── Requests ──────────────────────────────────────────────────────────────────

class ActualizarPerfilRequest(BaseModel):
    """
    Payload para el caso de uso ActualizarPerfilDocente.
    Solo los campos que el docente puede modificar.
    """
    grado_academico: Optional[str] = Field(
        default=None,
        max_length=50,
        examples=["Maestría", "Doctorado", "Licenciatura"],
    )
    adscripcion: Optional[str] = Field(
        default=None,
        max_length=150,
        examples=["Departamento de Sistemas"],
    )
    categoria: Optional[str] = Field(
        default=None,
        max_length=100,
        examples=["Profesor Titular A", "Profesor Asociado B"],
    )
    telefono: Optional[str] = Field(
        default=None,
        max_length=20,
        examples=["5512345678"],
    )


class DocumentoHistoricoResponse(BaseModel):
    id: int
    nombre: str
    institucion: str
    categoria: str
    anio: int
    horas: Optional[int]
    estatus: str
    archivo_url: Optional[str]
    fecha_registro: datetime.datetime

    model_config = {"from_attributes": True}


class AgregarDocumentoHistoricoRequest(BaseModel):
    nombre: str = Field(..., max_length=255)
    institucion: str = Field(..., max_length=255)
    categoria: str = Field(..., max_length=50)
    anio: int
    horas: Optional[int] = None
    estatus: str = Field(..., max_length=50)
    archivo_url: Optional[str] = Field(None, max_length=500)

