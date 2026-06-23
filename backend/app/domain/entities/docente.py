"""
Entidades de dominio: Docente e HistorialCapacitacion
======================================================
Clases puras Python — sin imports de framework, ORM ni base de datos.
"""
from __future__ import annotations

import datetime
from dataclasses import dataclass, field
from typing import Optional

from app.domain.entities.usuario import Usuario


@dataclass
class HistorialCapacitacion:
    """Representa un registro de curso/certificación de un docente."""
    id: int
    usuario_id: int
    curso_id: int
    estatus: str                         # 'Inscrito' | 'Aprobado' | 'Reprobado'
    fecha_conclusion: Optional[datetime.date] = None

    # ── Reglas de negocio ───────────────────────────────────────────────────
    def esta_aprobado(self) -> bool:
        return self.estatus == "Aprobado"

    def esta_inscrito(self) -> bool:
        return self.estatus == "Inscrito"


@dataclass
class Docente:
    """
    Perfil académico de un docente.
    Agrega la relación con su cuenta de Usuario.
    """
    id: int
    usuario_id: int
    numero_empleado: str
    nombre: str
    apellidos: str
    telefono: Optional[str] = None
    categoria: Optional[str] = None
    adscripcion: Optional[str] = None
    grado_academico: Optional[str] = None
    es_ptc: bool = False
    usuario: Optional[Usuario] = field(default=None, repr=False)

    # ── Reglas de negocio ───────────────────────────────────────────────────
    @property
    def nombre_completo(self) -> str:
        return f"{self.nombre} {self.apellidos}"

    def es_profesor_tiempo_completo(self) -> bool:
        return self.es_ptc

    def puede_actualizar_perfil(self) -> bool:
        """Solo docentes con cuenta activa pueden modificar su perfil."""
        if self.usuario is None:
            return False
        return self.usuario.esta_activo()


@dataclass
class DocumentoHistorico:
    """Documento histórico subido por el docente (certificados, diplomados, etc)."""
    id: int
    docente_id: int
    nombre: str
    institucion: str
    categoria: str
    anio: int
    estatus: str
    horas: Optional[int] = None
    archivo_url: Optional[str] = None
    fecha_registro: Optional[datetime.datetime] = None
