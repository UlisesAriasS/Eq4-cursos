"""
Entry-point de la aplicación FastAPI — Eq4-Cursos Backend
==========================================================
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.database.connection import settings, SessionLocal
from app.infrastructure.database.seed import seed_if_empty
from app.infrastructure.web.routers.docente_router import router as docente_router
from app.infrastructure.web.routers.auth_router import router as auth_router
from app.infrastructure.web.routers.proyecto_router import router as proyecto_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ejecuta el seed al arrancar si la BD está vacía."""
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield  # aquí corre la app


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Eq4-Cursos API",
    description="Backend del sistema de gestión académica — Arquitectura Hexagonal.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth_router,     prefix="/api/v1")
app.include_router(docente_router,  prefix="/api/v1")
app.include_router(proyecto_router, prefix="/api/v1")


@app.get("/health", tags=["Status"])
def health_check():
    return {"status": "ok", "service": "eq4-cursos-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True)
