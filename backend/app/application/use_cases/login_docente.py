"""
Caso de Uso: LoginDocente
==========================
Verifica credenciales y retorna el perfil del docente.
"""
import bcrypt

from app.domain.ports.docente_repository import DocenteRepositoryPort
from app.application.dtos.auth_dtos import LoginRequest, LoginResponse


class LoginDocenteUseCase:
    def __init__(self, repo: DocenteRepositoryPort) -> None:
        self._repo = repo

    def execute(self, datos: LoginRequest) -> LoginResponse:
        docente = self._repo.obtener_por_correo(datos.correo)

        if docente is None:
            raise ValueError("Correo o contraseña incorrectos.")

        if not bcrypt.checkpw(datos.password.encode(), docente.usuario.password_hash.encode()):
            raise ValueError("Correo o contraseña incorrectos.")

        if not docente.usuario.activo:
            raise ValueError("La cuenta está deshabilitada.")

        perfil_completo = all([
            docente.grado_academico,
            docente.categoria,
            docente.adscripcion,
        ])

        return LoginResponse(
            usuario_id=docente.usuario_id,
            docente_id=docente.id,
            correo=docente.usuario.correo,
            numero_empleado=docente.numero_empleado,
            nombre=docente.nombre,
            apellidos=docente.apellidos,
            nombre_completo=docente.nombre_completo,
            categoria=docente.categoria,
            adscripcion=docente.adscripcion,
            grado_academico=docente.grado_academico,
            es_ptc=docente.es_ptc,
            perfil_completo=perfil_completo,
        )
