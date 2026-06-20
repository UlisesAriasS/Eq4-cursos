"""
Caso de Uso: ObtenerPerfilDocente
==================================
Recupera la información básica del docente y su cuenta de usuario.

Dependencias:
- Puerto DocenteRepositoryPort (inyectado, nunca la implementación concreta)
- DTO PerfilDocenteResponse (para serializar la respuesta)
"""
from app.domain.ports.docente_repository import DocenteRepositoryPort
from app.application.dtos.docente_dtos import PerfilDocenteResponse, UsuarioResponse


class ObtenerPerfilDocenteUseCase:
    """
    Caso de uso de lectura del perfil académico de un docente.

    Orquesta: puerto → entidad de dominio → DTO de respuesta.
    No contiene lógica de negocio propia; delega las reglas al dominio.
    """

    def __init__(self, docente_repo: DocenteRepositoryPort) -> None:
        self._repo = docente_repo

    def execute(self, usuario_id: int) -> PerfilDocenteResponse:
        """
        Ejecuta el caso de uso.

        Args:
            usuario_id: ID de la cuenta de usuario del docente.

        Returns:
            PerfilDocenteResponse con los datos del docente.

        Raises:
            ValueError: Si no existe un docente asociado a ese usuario_id.
        """
        docente = self._repo.obtener_por_usuario_id(usuario_id)

        if docente is None:
            raise ValueError(
                f"No se encontró un docente con usuario_id={usuario_id}"
            )

        # Mapear entidad de dominio → DTO
        usuario_dto = UsuarioResponse(
            id=docente.usuario.id,
            correo=docente.usuario.correo,
            rol_id=docente.usuario.rol_id,
            activo=docente.usuario.activo,
        )

        return PerfilDocenteResponse(
            id=docente.id,
            usuario_id=docente.usuario_id,
            numero_empleado=docente.numero_empleado,
            nombre=docente.nombre,
            apellidos=docente.apellidos,
            nombre_completo=docente.nombre_completo,
            categoria=docente.categoria,
            adscripcion=docente.adscripcion,
            grado_academico=docente.grado_academico,
            es_ptc=docente.es_ptc,
            usuario=usuario_dto,
        )
