# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — Frontend React/Vite (Eq4-Cursos)
# Modo: desarrollo con hot-reload
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-slim

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Instalar dependencias primero (cache layer)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Copiar el resto del código
COPY . .

EXPOSE 5173

CMD ["pnpm", "dev"]
