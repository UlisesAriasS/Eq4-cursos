"""
Modelos ORM (SQLAlchemy)
========================
Mapean las tablas MySQL existentes a clases Python.
Solo la capa de Infraestructura conoce estos modelos; el Dominio y
la Aplicación NO los importan.
"""
import datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.infrastructure.database.connection import Base


class RolORM(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    usuarios: Mapped[list["UsuarioORM"]] = relationship("UsuarioORM", back_populates="rol")


class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    correo: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    ultimo_acceso: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    fecha_registro: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relaciones
    rol: Mapped["RolORM"] = relationship("RolORM", back_populates="usuarios")
    docente: Mapped[Optional["DocenteORM"]] = relationship(
        "DocenteORM", back_populates="usuario", uselist=False
    )
    historial: Mapped[list["HistorialCapacitacionORM"]] = relationship(
        "HistorialCapacitacionORM", back_populates="usuario"
    )


class DocenteORM(Base):
    __tablename__ = "docentes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    numero_empleado: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(100), nullable=False)
    telefono: Mapped[Optional[str]] = mapped_column(String(20))
    categoria: Mapped[Optional[str]] = mapped_column(String(100))
    adscripcion: Mapped[Optional[str]] = mapped_column(String(150))
    grado_academico: Mapped[Optional[str]] = mapped_column(String(50))
    es_ptc: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relaciones
    usuario: Mapped["UsuarioORM"] = relationship("UsuarioORM", back_populates="docente")
    documentos_historicos: Mapped[list["DocumentoHistoricoORM"]] = relationship(
        "DocumentoHistoricoORM", back_populates="docente"
    )

class DocumentoHistoricoORM(Base):
    __tablename__ = "documentos_historicos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    docente_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("docentes.id", ondelete="CASCADE"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)
    institucion: Mapped[str] = mapped_column(String(255), nullable=False)
    categoria: Mapped[str] = mapped_column(String(100), nullable=False)
    anio: Mapped[int] = mapped_column(Integer, nullable=False)
    horas: Mapped[Optional[int]] = mapped_column(Integer)
    estatus: Mapped[str] = mapped_column(String(100), nullable=False)
    archivo_url: Mapped[Optional[str]] = mapped_column(String(500))
    fecha_registro: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow
    )

    docente: Mapped["DocenteORM"] = relationship(
        "DocenteORM", back_populates="documentos_historicos"
    )



class CursoCertificacionORM(Base):
    __tablename__ = "cursos_certificaciones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    tipo: Mapped[str] = mapped_column(Enum("Curso Alumno", "Curso Docente", "Certificación Oficial"), nullable=False)
    horas: Mapped[int] = mapped_column(Integer, nullable=False)
    responsable_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("docentes.id", ondelete="SET NULL"), nullable=True)


class HistorialCapacitacionORM(Base):
    __tablename__ = "historial_capacitacion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False
    )
    curso_id: Mapped[int] = mapped_column(Integer, ForeignKey("cursos_certificaciones.id"), nullable=False)
    estatus: Mapped[str] = mapped_column(
        Enum("Inscrito", "Aprobado", "Reprobado"), default="Inscrito"
    )
    archivo_evidencia_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    fecha_conclusion: Mapped[Optional[datetime.date]] = mapped_column(Date, nullable=True)

    # Relaciones
    usuario: Mapped["UsuarioORM"] = relationship(
        "UsuarioORM", back_populates="historial"
    )


class PeriodoAcademicoORM(Base):
    __tablename__ = "periodos_academicos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    fecha_inicio: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=False)

    proyectos: Mapped[list["ProyectoIntegradorORM"]] = relationship(
        "ProyectoIntegradorORM", back_populates="periodo"
    )


class AlumnoORM(Base):
    __tablename__ = "alumnos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    matricula: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(100), nullable=False)
    programa_educativo: Mapped[Optional[str]] = mapped_column(String(150))
    semestre: Mapped[int] = mapped_column(Integer, nullable=False)
    grupo: Mapped[str] = mapped_column(String(10), nullable=False)


class ProyectoIntegradorORM(Base):
    __tablename__ = "proyectos_integradores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    docente_director_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("docentes.id"), nullable=False
    )
    periodo_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("periodos_academicos.id"), nullable=False
    )
    nombre_proyecto: Mapped[str] = mapped_column(String(255), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    linea_trabajo: Mapped[Optional[str]] = mapped_column(String(150))
    estatus_general: Mapped[str] = mapped_column(
        Enum("Propuesta", "Aprobado", "En Desarrollo", "Finalizado", "Cancelado"),
        default="Propuesta",
    )
    fecha_registro: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow
    )

    periodo: Mapped["PeriodoAcademicoORM"] = relationship(
        "PeriodoAcademicoORM", back_populates="proyectos"
    )
    proyecto_alumnos: Mapped[list["ProyectoAlumnoORM"]] = relationship(
        "ProyectoAlumnoORM", back_populates="proyecto", cascade="all, delete-orphan"
    )


class ProyectoAlumnoORM(Base):
    __tablename__ = "proyecto_alumnos"

    proyecto_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("proyectos_integradores.id", ondelete="CASCADE"), primary_key=True
    )
    alumno_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("alumnos.id", ondelete="CASCADE"), primary_key=True
    )
    docente_curso_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("docentes.id", ondelete="SET NULL"), nullable=True
    )
    rol_equipo: Mapped[Optional[str]] = mapped_column(String(100))
    calificacion_parcial_curso: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    calificacion_general_proyecto: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))

    proyecto: Mapped["ProyectoIntegradorORM"] = relationship(
        "ProyectoIntegradorORM", back_populates="proyecto_alumnos"
    )
    alumno: Mapped["AlumnoORM"] = relationship("AlumnoORM")
