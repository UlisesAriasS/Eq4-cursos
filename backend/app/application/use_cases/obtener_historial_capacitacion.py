"""
Caso de Uso: ObtenerHistorialCapacitacion
==========================================
Lista los cursos y certificaciones que el docente ha completado
o en los que está inscrito.
"""
from app.domain.ports.docente_repository import DocenteRepositoryPort
from app.application.dtos.docente_dtos import (
    HistorialCapacitacionResponse,
    HistorialCapacitacionItemResponse,
)


class ObtenerHistorialCapacitacionUseCase:
    """
    Caso de uso de lectura: obtiene el historial completo de capacitación.

    No impone filtros adicionales; la capa web puede añadir paginación.
    """

    def __init__(self, docente_repo: DocenteRepositoryPort) -> None:
        self._repo = docente_repo

    def execute(self, usuario_id: int) -> HistorialCapacitacionResponse:
        """
        Args:
            usuario_id: ID de la cuenta de usuario del docente.

        Returns:
            HistorialCapacitacionResponse con la lista de registros.

        Raises:
            ValueError: Si no existe un docente con ese usuario_id.
        """
        # Verificar que el docente existe antes de listar su historial
        docente = self._repo.obtener_por_usuario_id(usuario_id)
        if docente is None:
            raise ValueError(
                f"No se encontró un docente con usuario_id={usuario_id}"
            )

        registros = self._repo.obtener_historial_capacitacion(usuario_id)

        items = [
            HistorialCapacitacionItemResponse(
                id=r.id,
                curso_id=r.curso_id,
                estatus=r.estatus,
                fecha_conclusion=r.fecha_conclusion,
            )
            for r in registros
        ]

        return HistorialCapacitacionResponse(
            usuario_id=usuario_id,
            total=len(items),
            registros=items,
        )
