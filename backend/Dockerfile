# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — Backend FastAPI (Eq4-Cursos)
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# Evita archivos .pyc y habilita logs sin buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias para PyMySQL y cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python primero (capa cacheada)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Puerto que expone la API
EXPOSE 8000

# Comando de arranque (sin --reload en producción)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
