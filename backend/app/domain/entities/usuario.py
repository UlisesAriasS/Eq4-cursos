"""
Entidad de dominio: Usuario
============================
Clase pura Python — sin imports de framework, ORM ni base de datos.
Representa la cuenta de acceso de un docente en el sistema.
"""
from dataclasses import dataclass


@dataclass
class Usuario:
    id: int
    correo: str
    rol_id: int
    activo: bool
    password_hash: str = ""   # necesario para verificar login

    def esta_activo(self) -> bool:
        return self.activo
