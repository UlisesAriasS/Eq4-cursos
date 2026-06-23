from typing import List
from app.application.dtos.docente_dtos import DocumentoHistoricoResponse
from app.domain.ports.docente_repository import DocenteRepositoryPort


class ObtenerDocumentosHistoricosUseCase:
    def __init__(self, repo: DocenteRepositoryPort) -> None:
        self._repo = repo

    def execute(self, usuario_id: int) -> List[DocumentoHistoricoResponse]:
        docente = self._repo.obtener_por_usuario_id(usuario_id)
        if not docente:
            raise ValueError("Docente no encontrado")
        
        documentos = self._repo.obtener_documentos_historicos(docente.id)
        return [
            DocumentoHistoricoResponse(
                id=doc.id,
                nombre=doc.nombre,
                institucion=doc.institucion,
                categoria=doc.categoria,
                anio=doc.anio,
                horas=doc.horas,
                estatus=doc.estatus,
                archivo_url=doc.archivo_url,
                fecha_registro=doc.fecha_registro,
            )
            for doc in documentos
        ]
