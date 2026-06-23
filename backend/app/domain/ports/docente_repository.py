"""
Puerto (Port) del repositorio de Docentes
==========================================
Define el CONTRATO que cualquier adaptador de persistencia debe cumplir.
Esta interfaz NO importa nada de SQLAlchemy, MySQL u otro framework.

Las implementaciones concretas viven en infrastructure/database/.
"""
from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.docente import Docente, HistorialCapacitacion


class DocenteRepositoryPort(ABC):
    """
    Puerto de salida (Secondary/Driven Port).
    La capa de Aplicación depende de esta abstracción, nunca de la implementación.
    """

    @abstractmethod
    def obtener_por_usuario_id(self, usuario_id: int) -> Optional[Docente]:
        """
        Recupera el perfil completo del docente (con su Usuario vinculado)
        a partir del ID de la cuenta de usuario.

        Retorna None si no existe un docente con ese usuario_id.
        """
        ...

    @abstractmethod
    def actualizar(self, docente: Docente) -> Docente:
        """
        Persiste los cambios de un Docente existente.
        Retorna la entidad actualizada.

        Lanza ValueError si el docente no existe en la base de datos.
        """
        ...

    @abstractmethod
    def obtener_historial_capacitacion(
        self, usuario_id: int
    ) -> List[HistorialCapacitacion]:
        """
        Lista todos los registros del historial de capacitación
        asociados a un usuario_id.

        Retorna lista vacía si no hay registros.
        """
        ...

    @abstractmethod
    def obtener_por_correo(self, correo: str) -> Optional["Docente"]:
        """
        Busca un docente por el correo de su cuenta de usuario.
        Retorna None si no existe.
        """
        ...

    @abstractmethod
    def obtener_documentos_historicos(self, docente_id: int) -> List["DocumentoHistorico"]:
        """
        Lista todos los documentos históricos asociados a un docente_id.
        """
        ...

    @abstractmethod
    def agregar_documento_historico(self, documento: "DocumentoHistorico") -> "DocumentoHistorico":
        """
        Agrega un nuevo documento histórico al docente.
        Retorna la entidad guardada con su ID generado.
        """
        ...

    @abstractmethod
    def eliminar_documento_historico(self, docente_id: int, documento_id: int) -> bool:
        """
        Elimina un documento histórico si pertenece al docente.
        """
        ...
