"""
Router de Autenticación
========================
POST /api/v1/auth/login
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dtos.auth_dtos import LoginRequest, LoginResponse
from app.application.use_cases.login_docente import LoginDocenteUseCase
from app.infrastructure.web.dependencies import get_login_use_case

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión",
)
def login(
    body: LoginRequest,
    use_case: LoginDocenteUseCase = Depends(get_login_use_case),
) -> LoginResponse:
    try:
        return use_case.execute(body)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc
