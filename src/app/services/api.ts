/**
 * api.ts — Cliente centralizado del backend FastAPI
 * Todas las llamadas HTTP pasan por aquí.
 * El proxy de Vite redirige /api/* → http://localhost:8000/api/*
 */

const BASE = "/api/v1";

// ─── Tipos que espeja los DTOs del backend ─────────────────────────────────

export interface LoginResponse {
  usuario_id: number;
  correo: string;
  numero_empleado: string;
  nombre: string;
  apellidos: string;
  nombre_completo: string;
  categoria: string | null;
  adscripcion: string | null;
  grado_academico: string | null;
  es_ptc: boolean;
  perfil_completo: boolean;
}

export interface PerfilDocente extends Omit<LoginResponse, "perfil_completo"> {
  usuario: { id: number; correo: string; rol_id: number; activo: boolean };
}

export interface ActualizarPerfilPayload {
  grado_academico?: string;
  adscripcion?: string;
  categoria?: string;
}

// ─── Helper ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error de red" }));
    throw new Error(err.detail ?? "Error desconocido");
  }

  return res.json() as Promise<T>;
}

// ─── Endpoints ─────────────────────────────────────────────────────────────

export const api = {
  /** POST /auth/login */
  login: (correo: string, password: string) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, password }),
    }),

  /** GET /docentes/{id}/perfil */
  getPerfil: (usuarioId: number) =>
    request<PerfilDocente>(`/docentes/${usuarioId}/perfil`),

  /** PATCH /docentes/{id}/perfil */
  updatePerfil: (usuarioId: number, datos: ActualizarPerfilPayload) =>
    request<PerfilDocente>(`/docentes/${usuarioId}/perfil`, {
      method: "PATCH",
      body: JSON.stringify(datos),
    }),
};
