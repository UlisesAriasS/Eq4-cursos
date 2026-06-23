from app.domain.ports.docente_repository import DocenteRepositoryPort

class EliminarDocumentoHistoricoUseCase:
    def __init__(self, repo: DocenteRepositoryPort) -> None:
        self._repo = repo

    def execute(self, usuario_id: int, documento_id: int) -> bool:
        docente = self._repo.obtener_por_usuario_id(usuario_id)
        if not docente:
            raise ValueError("Docente no encontrado")
            
        eliminado = self._repo.eliminar_documento_historico(docente.id, documento_id)
        if not eliminado:
            raise ValueError("Documento no encontrado o no pertenece al docente")
        return True
