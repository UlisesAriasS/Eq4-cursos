"""
Modelos ORM (SQLAlchemy)
========================
Mapean las tablas MySQL existentes a clases Python.
Solo la capa de Infraestructura conoce estos modelos; el Dominio y
la Aplicación NO los importan.
"""
import datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, String
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
    categoria: Mapped[Optional[str]] = mapped_column(String(100))
    adscripcion: Mapped[Optional[str]] = mapped_column(String(150))
    grado_academico: Mapped[Optional[str]] = mapped_column(String(50))
    es_ptc: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relaciones
    usuario: Mapped["UsuarioORM"] = relationship("UsuarioORM", back_populates="docente")


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
