"""
Adaptador de Base de Datos: DocenteRepositoryImpl
==================================================
Implementación concreta del puerto DocenteRepositoryPort usando SQLAlchemy.

Esta clase "sabe" de MySQL y SQLAlchemy. El Dominio y la Aplicación NO.
El flujo de datos es siempre:
    ORM Model → Entidad de Dominio (al leer)
    Entidad de Dominio → ORM Model (al escribir)
"""
from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.docente import Docente, HistorialCapacitacion, DocumentoHistorico
from app.domain.entities.usuario import Usuario
from app.domain.ports.docente_repository import DocenteRepositoryPort
from app.infrastructure.database.models import (
    CursoCertificacionORM,
    DocenteORM,
    DocumentoHistoricoORM,
    HistorialCapacitacionORM,
    UsuarioORM,
)


class DocenteRepositoryImpl(DocenteRepositoryPort):
    """Adaptador secundario: conecta el dominio con MySQL vía SQLAlchemy."""

    def __init__(self, db: Session) -> None:
        self._db = db

    # ── Mappers privados ────────────────────────────────────────────────────────

    @staticmethod
    def _to_usuario_entity(orm: UsuarioORM) -> Usuario:
        return Usuario(
            id=orm.id,
            correo=orm.correo,
            rol_id=orm.rol_id,
            activo=orm.activo,
            password_hash=orm.password_hash,
        )

    @staticmethod
    def _to_docente_entity(orm: DocenteORM) -> Docente:
        usuario = DocenteRepositoryImpl._to_usuario_entity(orm.usuario)
        return Docente(
            id=orm.id,
            usuario_id=orm.usuario_id,
            numero_empleado=orm.numero_empleado,
            nombre=orm.nombre,
            apellidos=orm.apellidos,
            telefono=orm.telefono,
            categoria=orm.categoria,
            adscripcion=orm.adscripcion,
            grado_academico=orm.grado_academico,
            es_ptc=orm.es_ptc,
            usuario=usuario,
        )

    @staticmethod
    def _to_historial_entity(orm: HistorialCapacitacionORM) -> HistorialCapacitacion:
        return HistorialCapacitacion(
            id=orm.id,
            usuario_id=orm.usuario_id,
            curso_id=orm.curso_id,
            estatus=orm.estatus,
            fecha_conclusion=orm.fecha_conclusion,
        )

    @staticmethod
    def _to_documento_historico_entity(orm: DocumentoHistoricoORM) -> DocumentoHistorico:
        return DocumentoHistorico(
            id=orm.id,
            docente_id=orm.docente_id,
            nombre=orm.nombre,
            institucion=orm.institucion,
            categoria=orm.categoria,
            anio=orm.anio,
            horas=orm.horas,
            estatus=orm.estatus,
            archivo_url=orm.archivo_url,
            fecha_registro=orm.fecha_registro,
        )

    # ── Implementación del puerto ───────────────────────────────────────────────

    def obtener_por_usuario_id(self, usuario_id: int) -> Optional[Docente]:
        """
        Consulta el docente junto con su usuario en un solo query (JOIN).
        Retorna None si no existe.
        """
        orm_docente = (
            self._db.query(DocenteORM)
            .join(UsuarioORM, DocenteORM.usuario_id == UsuarioORM.id)
            .filter(DocenteORM.usuario_id == usuario_id)
            .first()
        )
        if orm_docente is None:
            return None
        return self._to_docente_entity(orm_docente)

    def actualizar(self, docente: Docente) -> Docente:
        """
        Actualiza solo los campos editables: grado_academico, adscripcion, categoria.
        Lanza ValueError si el registro no existe.
        """
        orm_docente = (
            self._db.query(DocenteORM)
            .filter(DocenteORM.usuario_id == docente.usuario_id)
            .first()
        )
        if orm_docente is None:
            raise ValueError(
                f"No se encontró registro de docente para usuario_id={docente.usuario_id}"
            )

        # Aplicar cambios al ORM
        orm_docente.grado_academico = docente.grado_academico
        orm_docente.adscripcion = docente.adscripcion
        orm_docente.categoria = docente.categoria
        orm_docente.telefono = docente.telefono

        self._db.commit()
        self._db.refresh(orm_docente)

        return self._to_docente_entity(orm_docente)

    def obtener_historial_capacitacion(
        self, usuario_id: int
    ) -> List[dict]:
        """Lista todos los registros de capacitación del docente con datos del curso."""
        rows = (
            self._db.query(HistorialCapacitacionORM, CursoCertificacionORM)
            .join(
                CursoCertificacionORM,
                HistorialCapacitacionORM.curso_id == CursoCertificacionORM.id,
            )
            .filter(HistorialCapacitacionORM.usuario_id == usuario_id)
            .order_by(HistorialCapacitacionORM.fecha_conclusion.desc())
            .all()
        )
        return [
            {
                "id": h.id,
                "curso_id": h.curso_id,
                "nombre_curso": c.nombre,
                "tipo_curso": c.tipo,
                "horas": c.horas,
                "estatus": h.estatus,
                "fecha_conclusion": h.fecha_conclusion,
            }
            for h, c in rows
        ]

    def obtener_por_correo(self, correo: str) -> Optional[Docente]:
        """Busca un docente por el correo de su cuenta de usuario."""
        orm_docente = (
            self._db.query(DocenteORM)
            .join(UsuarioORM, DocenteORM.usuario_id == UsuarioORM.id)
            .filter(UsuarioORM.correo == correo)
            .first()
        )
        if orm_docente is None:
            return None
        return self._to_docente_entity(orm_docente)

    def obtener_documentos_historicos(self, docente_id: int) -> List[DocumentoHistorico]:
        """Lista todos los documentos históricos asociados a un docente_id."""
        rows = (
            self._db.query(DocumentoHistoricoORM)
            .filter(DocumentoHistoricoORM.docente_id == docente_id)
            .order_by(DocumentoHistoricoORM.fecha_registro.desc())
            .all()
        )
        return [self._to_documento_historico_entity(r) for r in rows]

    def agregar_documento_historico(self, documento: DocumentoHistorico) -> DocumentoHistorico:
        """Agrega un nuevo documento histórico al docente."""
        orm_doc = DocumentoHistoricoORM(
            docente_id=documento.docente_id,
            nombre=documento.nombre,
            institucion=documento.institucion,
            categoria=documento.categoria,
            anio=documento.anio,
            horas=documento.horas,
            estatus=documento.estatus,
            archivo_url=documento.archivo_url,
        )
        self._db.add(orm_doc)
        self._db.commit()
        self._db.refresh(orm_doc)
        return self._to_documento_historico_entity(orm_doc)

    def eliminar_documento_historico(self, docente_id: int, documento_id: int) -> bool:
        """Elimina un documento histórico si pertenece al docente."""
        result = self._db.query(DocumentoHistoricoORM).filter(
            DocumentoHistoricoORM.id == documento_id,
            DocumentoHistoricoORM.docente_id == docente_id
        ).delete()
        self._db.commit()
        return result > 0


