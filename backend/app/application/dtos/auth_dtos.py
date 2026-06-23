"""
DTOs de Autenticación
======================
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    correo: str
    password: str


class LoginResponse(BaseModel):
    usuario_id: int
    docente_id: int          # ID de la tabla docentes (distinto a usuario_id)
    correo: str
    numero_empleado: str
    nombre: str
    apellidos: str
    nombre_completo: str
    categoria: Optional[str] = None
    adscripcion: Optional[str] = None
    grado_academico: Optional[str] = None
    es_ptc: bool
    perfil_completo: bool   # True si tiene grado, categoría y adscripción
