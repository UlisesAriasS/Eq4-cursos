"""
Router FastAPI — Módulo Docentes
==================================
Adaptador primario (Web/Driving Adapter).
Expone los 3 endpoints REST del módulo de Perfil Académico.

Los endpoints reciben HTTP y delegan al caso de uso correspondiente.
No contienen lógica de negocio.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import io
import zipfile

from typing import List
from app.application.dtos.docente_dtos import (
    ActualizarPerfilRequest,
    HistorialCapacitacionResponse,
    PerfilDocenteResponse,
    DocumentoHistoricoResponse,
    AgregarDocumentoHistoricoRequest,
)
from app.application.use_cases.actualizar_perfil_docente import ActualizarPerfilDocenteUseCase
from app.application.use_cases.obtener_historial_capacitacion import ObtenerHistorialCapacitacionUseCase
from app.application.use_cases.obtener_perfil_docente import ObtenerPerfilDocenteUseCase
from app.application.use_cases.obtener_documentos_historicos import ObtenerDocumentosHistoricosUseCase
from app.application.use_cases.agregar_documento_historico import AgregarDocumentoHistoricoUseCase
from app.application.use_cases.eliminar_documento_historico import EliminarDocumentoHistoricoUseCase
from app.infrastructure.web.dependencies import (
    get_actualizar_perfil_use_case,
    get_historial_use_case,
    get_obtener_perfil_use_case,
    get_obtener_documentos_historicos_use_case,
    get_agregar_documento_historico_use_case,
    get_eliminar_documento_historico_use_case,
)

router = APIRouter(
    prefix="/docentes",
    tags=["Perfil Académico de Docentes"],
)


@router.get(
    "/{usuario_id}/perfil",
    response_model=PerfilDocenteResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener perfil académico del docente",
    description=(
        "Recupera la información básica del docente (nombre, apellidos, "
        "número de empleado, grado académico, categoría) y su cuenta de usuario vinculada."
    ),
)
def obtener_perfil(
    usuario_id: int,
    use_case: ObtenerPerfilDocenteUseCase = Depends(get_obtener_perfil_use_case),
) -> PerfilDocenteResponse:
    try:
        return use_case.execute(usuario_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.patch(
    "/{usuario_id}/perfil",
    response_model=PerfilDocenteResponse,
    status_code=status.HTTP_200_OK,
    summary="Actualizar perfil académico del docente",
    description=(
        "Permite al docente actualizar su grado académico, adscripción y/o categoría. "
        "Solo se modifican los campos enviados en el body (PATCH semántico)."
    ),
)
def actualizar_perfil(
    usuario_id: int,
    body: ActualizarPerfilRequest,
    use_case: ActualizarPerfilDocenteUseCase = Depends(get_actualizar_perfil_use_case),
) -> PerfilDocenteResponse:
    try:
        return use_case.execute(usuario_id, body)
    except ValueError as exc:
        # Distinguir "no encontrado" de "cuenta inactiva"
        detail = str(exc)
        code = (
            status.HTTP_403_FORBIDDEN
            if "inactiva" in detail
            else status.HTTP_404_NOT_FOUND
        )
        raise HTTPException(status_code=code, detail=detail) from exc


@router.get(
    "/{usuario_id}/historial-capacitacion",
    response_model=HistorialCapacitacionResponse,
    status_code=status.HTTP_200_OK,
    summary="Obtener historial de capacitación del docente",
    description=(
        "Lista todos los cursos y certificaciones que el docente ha completado "
        "o en los que está inscrito, ordenados por fecha de conclusión descendente."
    ),
)
def obtener_historial(
    usuario_id: int,
    use_case: ObtenerHistorialCapacitacionUseCase = Depends(get_historial_use_case),
) -> HistorialCapacitacionResponse:
    try:
        return use_case.execute(usuario_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.get(
    "/{usuario_id}/documentos-historicos",
    response_model=List[DocumentoHistoricoResponse],
    status_code=status.HTTP_200_OK,
    summary="Obtener documentos históricos",
)
def obtener_documentos_historicos(
    usuario_id: int,
    use_case: ObtenerDocumentosHistoricosUseCase = Depends(get_obtener_documentos_historicos_use_case),
) -> List[DocumentoHistoricoResponse]:
    return use_case.execute(usuario_id)


@router.post(
    "/{usuario_id}/documentos-historicos",
    response_model=DocumentoHistoricoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Agregar documento histórico",
)
def agregar_documento_historico(
    usuario_id: int,
    body: AgregarDocumentoHistoricoRequest,
    use_case: AgregarDocumentoHistoricoUseCase = Depends(get_agregar_documento_historico_use_case),
) -> DocumentoHistoricoResponse:
    return use_case.execute(usuario_id, body)


@router.delete(
    "/{usuario_id}/documentos-historicos/{documento_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar documento histórico",
)
def eliminar_documento_historico(
    usuario_id: int,
    documento_id: int,
    use_case: EliminarDocumentoHistoricoUseCase = Depends(get_eliminar_documento_historico_use_case),
):
    try:
        use_case.execute(usuario_id, documento_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.get(
    "/{usuario_id}/descargar-expediente",
    summary="Descargar expediente en ZIP",
    description="Genera un archivo ZIP con el resumen del expediente del docente.",
)
def descargar_expediente(
    usuario_id: int,
    use_case_perfil = Depends(get_obtener_perfil_use_case),
    use_case_docs = Depends(get_obtener_documentos_historicos_use_case),
):
    try:
        perfil = use_case_perfil.execute(usuario_id)
        docs = use_case_docs.execute(usuario_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
        
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        resumen = f"Expediente de {perfil.nombre_completo}\n\n"
        resumen += f"Grado: {perfil.grado_academico}\n"
        resumen += f"Categoría: {perfil.categoria}\n\n"
        resumen += "Documentos Históricos:\n"
        for doc in docs:
            resumen += f"- {doc.nombre} ({doc.institucion}, {doc.anio})\n"
        
        zf.writestr("resumen_expediente.txt", resumen.encode('utf-8'))
        
        for doc in docs:
            if doc.archivo_url:
                zf.writestr(f"documentos/{doc.archivo_url}", b"%PDF-1.4\n(Contenido simulado del documento)")

    zip_buffer.seek(0)
    filename = f"expediente_{perfil.numero_empleado}.zip"
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
