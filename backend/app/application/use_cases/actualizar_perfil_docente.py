"""
Caso de Uso: ActualizarPerfilDocente
=====================================
Permite al docente actualizar su grado académico, adscripción y categoría.

Solo modifica los campos que el docente tiene permiso de cambiar.
La regla de negocio (puede_actualizar_perfil) se verifica en la entidad de dominio.
"""
from app.domain.ports.docente_repository import DocenteRepositoryPort
from app.application.dtos.docente_dtos import (
    ActualizarPerfilRequest,
    PerfilDocenteResponse,
    UsuarioResponse,
)


class ActualizarPerfilDocenteUseCase:
    """
    Caso de uso de escritura: actualiza campos editables del perfil.

    Regla de negocio aplicada aquí:
    - Solo se persiste si el docente tiene cuenta activa.
    - Solo se actualizan los campos provistos (PATCH semántico).
    """

    def __init__(self, docente_repo: DocenteRepositoryPort) -> None:
        self._repo = docente_repo

    def execute(
        self, usuario_id: int, datos: ActualizarPerfilRequest
    ) -> PerfilDocenteResponse:
        """
        Args:
            usuario_id: ID de la cuenta de usuario del docente.
            datos: Campos a actualizar (solo los enviados en el request).

        Returns:
            PerfilDocenteResponse con los datos ya actualizados.

        Raises:
            ValueError: Si no existe el docente o su cuenta está inactiva.
        """
        docente = self._repo.obtener_por_usuario_id(usuario_id)

        if docente is None:
            raise ValueError(
                f"No se encontró un docente con usuario_id={usuario_id}"
            )

        # Regla de negocio del dominio
        if not docente.puede_actualizar_perfil():
            raise ValueError(
                "El docente no puede actualizar su perfil porque su cuenta está inactiva."
            )

        # Aplicar solo los campos provistos (PATCH semántico)
        if datos.grado_academico is not None:
            docente.grado_academico = datos.grado_academico
        if datos.adscripcion is not None:
            docente.adscripcion = datos.adscripcion
        if datos.categoria is not None:
            docente.categoria = datos.categoria

        # Persistir a través del puerto
        docente_actualizado = self._repo.actualizar(docente)

        # Mapear → DTO
        usuario_dto = UsuarioResponse(
            id=docente_actualizado.usuario.id,
            correo=docente_actualizado.usuario.correo,
            rol_id=docente_actualizado.usuario.rol_id,
            activo=docente_actualizado.usuario.activo,
        )

        return PerfilDocenteResponse(
            id=docente_actualizado.id,
            usuario_id=docente_actualizado.usuario_id,
            numero_empleado=docente_actualizado.numero_empleado,
            nombre=docente_actualizado.nombre,
            apellidos=docente_actualizado.apellidos,
            nombre_completo=docente_actualizado.nombre_completo,
            categoria=docente_actualizado.categoria,
            adscripcion=docente_actualizado.adscripcion,
            grado_academico=docente_actualizado.grado_academico,
            es_ptc=docente_actualizado.es_ptc,
            usuario=usuario_dto,
        )
