"""
Puerto (Interfaz) del Repositorio de Proyectos
===============================================
Define el contrato que deben implementar los adaptadores de infraestructura.
El Dominio y la Aplicación solo conocen esta interfaz, NUNCA la implementación.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.proyecto import AlumnoProyecto, ProyectoIntegrador


class ProyectoRepositoryPort(ABC):

    @abstractmethod
    def listar_por_docente(self, docente_id: int) -> List[ProyectoIntegrador]:
        """Devuelve todos los proyectos del docente director."""

    @abstractmethod
    def obtener_por_id(self, proyecto_id: int) -> Optional[ProyectoIntegrador]:
        """Devuelve un proyecto por su ID o None si no existe."""

    @abstractmethod
    def crear(self, proyecto: ProyectoIntegrador) -> ProyectoIntegrador:
        """Persiste un nuevo proyecto y retorna la entidad con ID asignado."""

    @abstractmethod
    def listar_alumnos(self, proyecto_id: int) -> List[AlumnoProyecto]:
        """Devuelve los alumnos inscritos en el proyecto con sus calificaciones."""

    @abstractmethod
    def actualizar_calificaciones(
        self,
        proyecto_id: int,
        alumno_id: int,
        parcial: Optional[float],
        general: Optional[float],
    ) -> None:
        """Actualiza las calificaciones de un alumno dentro de un proyecto."""
