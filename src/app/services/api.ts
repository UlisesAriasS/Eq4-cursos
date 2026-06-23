/**
 * api.ts — Cliente centralizado del backend FastAPI
 * Todas las llamadas HTTP pasan por aquí.
 * El proxy de Vite redirige /api/* → http://localhost:8000/api/*
 */

const BASE = "/api/v1";

// ─── Tipos que espeja los DTOs del backend ─────────────────────────────────

export interface LoginResponse {
  usuario_id: number;
  docente_id: number;
  correo: string;
  numero_empleado: string;
  nombre: string;
  apellidos: string;
  nombre_completo: string;
  telefono: string | null;
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
  telefono?: string;
  grado_academico?: string;
  adscripcion?: string;
  categoria?: string;
}

export interface HistorialItem {
  id: number;
  curso_id: number;
  nombre_curso: string;
  tipo_curso: string;
  horas: number;
  estatus: 'Inscrito' | 'Aprobado' | 'Reprobado';
  fecha_conclusion: string | null;
}

export interface HistorialResponse {
  usuario_id: number;
  total: number;
  registros: HistorialItem[];
}

export interface DocumentoHistorico {
  id: number;
  nombre: string;
  institucion: string;
  categoria: string;
  anio: number;
  horas: number | null;
  estatus: string;
  archivo_url: string | null;
  fecha_registro: string;
}

export interface AgregarDocumentoPayload {
  nombre: string;
  institucion: string;
  categoria: string;
  anio: number;
  horas: number | null;
  estatus: string;
  archivo_url: string | null;
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
      method: 'PATCH',
      body: JSON.stringify(datos),
    }),

  /** GET /docentes/{id}/historial-capacitacion */
  getHistorial: (usuarioId: number) =>
    request<HistorialResponse>(`/docentes/${usuarioId}/historial-capacitacion`),

  /** GET /docentes/{id}/documentos-historicos */
  getDocumentosHistoricos: (usuarioId: number) =>
    request<DocumentoHistorico[]>(`/docentes/${usuarioId}/documentos-historicos`),

  /** POST /docentes/{id}/documentos-historicos */
  addDocumentoHistorico: (usuarioId: number, datos: AgregarDocumentoPayload) =>
    request<DocumentoHistorico>(`/docentes/${usuarioId}/documentos-historicos`, {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  /** DELETE /docentes/{id}/documentos-historicos/{doc_id} */
  deleteDocumentoHistorico: (usuarioId: number, documentoId: string) =>
    request<void>(`/docentes/${usuarioId}/documentos-historicos/${documentoId}`, {
      method: 'DELETE',
    }),

  /** GET URL for Zip */
  getDescargarExpedienteUrl: (usuarioId: number) =>
    `${BASE}/docentes/${usuarioId}/descargar-expediente`
};
