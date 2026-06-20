"""
Seed de Base de Datos
======================
Si la tabla usuarios está vacía, inserta docentes de prueba
con contraseñas hasheadas con bcrypt. Se ejecuta al arrancar la API.
"""
import bcrypt
from sqlalchemy.orm import Session

from app.infrastructure.database.models import DocenteORM, UsuarioORM


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
def seed_if_empty(db: Session) -> None:
    """Inserta datos de prueba solo si no hay usuarios registrados."""
    if db.query(UsuarioORM).count() > 0:
        return  # Ya hay datos, no hacer nada

    print("⚙️  Base de datos vacía — insertando datos de prueba...")

    password_hash = _hash("profesor123")

    # ── Usuario 1: Docente activo con perfil completo ──────────────────────
    u1 = UsuarioORM(
        correo="juan.ramirez@universidad.edu.mx",
        password_hash=password_hash,
        rol_id=2,
        activo=True,
    )
    db.add(u1)
    db.flush()  # para obtener u1.id

    d1 = DocenteORM(
        usuario_id=u1.id,
        numero_empleado="EMP-2024-001",
        nombre="Juan Carlos",
        apellidos="Ramírez Torres",
        categoria="Profesor Titular A",
        adscripcion="Departamento de Sistemas y Computación",
        grado_academico="Maestría",
        es_ptc=True,
    )
    db.add(d1)

    # ── Usuario 2: Docente con perfil incompleto (para probar el modal) ───
    u2 = UsuarioORM(
        correo="maria.lopez@universidad.edu.mx",
        password_hash=password_hash,
        rol_id=2,
        activo=True,
    )
    db.add(u2)
    db.flush()

    d2 = DocenteORM(
        usuario_id=u2.id,
        numero_empleado="EMP-2024-002",
        nombre="María Elena",
        apellidos="López Sánchez",
        categoria=None,        # perfil incompleto a propósito
        adscripcion=None,
        grado_academico=None,
        es_ptc=False,
    )
    db.add(d2)

    db.commit()
    print("✅ Datos de prueba insertados correctamente.")
    print("   → juan.ramirez@universidad.edu.mx / profesor123  (perfil completo)")
    print("   → maria.lopez@universidad.edu.mx  / profesor123  (perfil incompleto)")
