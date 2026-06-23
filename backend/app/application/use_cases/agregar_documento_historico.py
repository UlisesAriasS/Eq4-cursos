from app.application.dtos.docente_dtos import (
    AgregarDocumentoHistoricoRequest,
    DocumentoHistoricoResponse,
)
from app.domain.entities.docente import DocumentoHistorico
from app.domain.ports.docente_repository import DocenteRepositoryPort


class AgregarDocumentoHistoricoUseCase:
    def __init__(self, repo: DocenteRepositoryPort) -> None:
        self._repo = repo

    def execute(self, usuario_id: int, datos: AgregarDocumentoHistoricoRequest) -> DocumentoHistoricoResponse:
        docente = self._repo.obtener_por_usuario_id(usuario_id)
        if not docente:
            raise ValueError("Docente no encontrado")
            
        nuevo_doc = DocumentoHistorico(
            id=0,
            docente_id=docente.id,
            nombre=datos.nombre,
            institucion=datos.institucion,
            categoria=datos.categoria,
            anio=datos.anio,
            horas=datos.horas,
            estatus=datos.estatus,
            archivo_url=datos.archivo_url,
        )
        guardado = self._repo.agregar_documento_historico(nuevo_doc)

        return DocumentoHistoricoResponse(
            id=guardado.id,
            nombre=guardado.nombre,
            institucion=guardado.institucion,
            categoria=guardado.categoria,
            anio=guardado.anio,
            horas=guardado.horas,
            estatus=guardado.estatus,
            archivo_url=guardado.archivo_url,
            fecha_registro=guardado.fecha_registro,
        )
