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

// ─── Helper y Base de Datos Simulada (Mock Fallback) ─────────────────────────

const MOCK_DB_KEY = "eq4_mock_db";

interface MockDB {
  usuarios: Record<string, any>;
  docentes: Record<number, any>;
  historial: Record<number, any[]>;
  documentos: Record<number, any[]>;
}

function getMockDB(): MockDB {
  const raw = localStorage.getItem(MOCK_DB_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Ignorar error de parseo
    }
  }

  const defaultDB: MockDB = {
    usuarios: {
      "juan.ramirez@universidad.edu.mx": {
        usuario_id: 1,
        docente_id: 1,
        correo: "juan.ramirez@universidad.edu.mx",
        numero_empleado: "EMP-2024-001",
        nombre: "Juan Carlos",
        apellidos: "Ramírez Torres",
        nombre_completo: "Juan Carlos Ramírez Torres",
        telefono: "555-1234",
        categoria: "Profesor Titular A",
        adscripcion: "Departamento de Sistemas y Computación",
        grado_academico: "Maestría",
        es_ptc: true,
        perfil_completo: true,
      },
      "maria.lopez@universidad.edu.mx": {
        usuario_id: 2,
        docente_id: 2,
        correo: "maria.lopez@universidad.edu.mx",
        numero_empleado: "EMP-2024-002",
        nombre: "María Elena",
        apellidos: "López Sánchez",
        nombre_completo: "María Elena López Sánchez",
        telefono: null,
        categoria: null,
        adscripcion: null,
        grado_academico: null,
        es_ptc: false,
        perfil_completo: false,
      }
    },
    docentes: {
      1: {
        usuario_id: 1,
        docente_id: 1,
        correo: "juan.ramirez@universidad.edu.mx",
        numero_empleado: "EMP-2024-001",
        nombre: "Juan Carlos",
        apellidos: "Ramírez Torres",
        nombre_completo: "Juan Carlos Ramírez Torres",
        telefono: "555-1234",
        categoria: "Profesor Titular A",
        adscripcion: "Departamento de Sistemas y Computación",
        grado_academico: "Maestría",
        es_ptc: true,
        usuario: { id: 1, correo: "juan.ramirez@universidad.edu.mx", rol_id: 2, activo: true }
      },
      2: {
        usuario_id: 2,
        docente_id: 2,
        correo: "maria.lopez@universidad.edu.mx",
        numero_empleado: "EMP-2024-002",
        nombre: "María Elena",
        apellidos: "López Sánchez",
        nombre_completo: "María Elena López Sánchez",
        telefono: null,
        categoria: null,
        adscripcion: null,
        grado_academico: null,
        es_ptc: false,
        usuario: { id: 2, correo: "maria.lopez@universidad.edu.mx", rol_id: 2, activo: true }
      }
    },
    historial: {
      1: [
        { id: 101, curso_id: 1, nombre_curso: "Diplomado en Competencias Docentes", tipo_curso: "Curso Docente", horas: 120, estatus: "Aprobado", fecha_conclusion: "2025-12-10" },
        { id: 102, curso_id: 2, nombre_curso: "Taller de Evaluación por Rúbricas", tipo_curso: "Curso Docente", horas: 40, estatus: "Inscrito", fecha_conclusion: null }
      ],
      2: []
    },
    documentos: {
      1: [
        { id: 201, nombre: "Título de Maestría", institucion: "UNAM", categoria: "Título de Posgrado", anio: 2020, horas: null, estatus: "Validado", archivo_url: null, fecha_registro: "2024-01-15T10:00:00Z" }
      ],
      2: []
    }
  };

  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(defaultDB));
  return defaultDB;
}

function saveMockDB(db: MockDB) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
}

function handleMockRequest<T>(path: string, options?: RequestInit): T {
  const db = getMockDB();
  const body = options?.body ? JSON.parse(options.body) : null;
  const method = options?.method?.toUpperCase() || "GET";

  // POST /auth/login
  if (path === "/auth/login" && method === "POST") {
    const { correo, password } = body;
    const user = db.usuarios[correo];
    if (user && password === "profesor123") {
      return user as T;
    }
    throw new Error("Credenciales inválidas (intente: juan.ramirez@universidad.edu.mx / profesor123)");
  }

  // GET /docentes/{id}/perfil
  const perfilMatch = path.match(/^\/docentes\/(\d+)\/perfil$/);
  if (perfilMatch && method === "GET") {
    const userId = parseInt(perfilMatch[1]);
    const docente = db.docentes[userId];
    if (docente) return docente as T;
    throw new Error("Docente no encontrado");
  }

  // PATCH /docentes/{id}/perfil
  if (perfilMatch && method === "PATCH") {
    const userId = parseInt(perfilMatch[1]);
    const docente = db.docentes[userId];
    if (docente) {
      const updatedDocente = { ...docente, ...body };
      db.docentes[userId] = updatedDocente;

      // Actualizar también en db.usuarios
      const userKey = Object.keys(db.usuarios).find(k => db.usuarios[k].usuario_id === userId);
      if (userKey) {
        db.usuarios[userKey] = {
          ...db.usuarios[userKey],
          ...body,
          perfil_completo: !!(
            (body.categoria ?? db.usuarios[userKey].categoria) &&
            (body.adscripcion ?? db.usuarios[userKey].adscripcion) &&
            (body.grado_academico ?? db.usuarios[userKey].grado_academico)
          )
        };
        db.docentes[userId].perfil_completo = db.usuarios[userKey].perfil_completo;
      }
      
      saveMockDB(db);
      return db.docentes[userId] as T;
    }
    throw new Error("Docente no encontrado");
  }

  // GET /docentes/{id}/historial-capacitacion
  const historialMatch = path.match(/^\/docentes\/(\d+)\/historial-capacitacion$/);
  if (historialMatch && method === "GET") {
    const userId = parseInt(historialMatch[1]);
    const registros = db.historial[userId] || [];
    return {
      usuario_id: userId,
      total: registros.length,
      registros: registros
    } as T;
  }

  // GET /docentes/{id}/documentos-historicos
  const docsMatch = path.match(/^\/docentes\/(\d+)\/documentos-historicos$/);
  if (docsMatch && method === "GET") {
    const userId = parseInt(docsMatch[1]);
    return (db.documentos[userId] || []) as T;
  }

  // POST /docentes/{id}/documentos-historicos
  if (docsMatch && method === "POST") {
    const userId = parseInt(docsMatch[1]);
    if (!db.documentos[userId]) {
      db.documentos[userId] = [];
    }
    const newDoc = {
      id: Math.floor(Math.random() * 100000),
      ...body,
      fecha_registro: new Date().toISOString()
    };
    db.documentos[userId].push(newDoc);
    saveMockDB(db);
    return newDoc as T;
  }

  // DELETE /docentes/{id}/documentos-historicos/{doc_id}
  const deleteDocMatch = path.match(/^\/docentes\/(\d+)\/documentos-historicos\/(.+)$/);
  if (deleteDocMatch && method === "DELETE") {
    const userId = parseInt(deleteDocMatch[1]);
    const docId = deleteDocMatch[2];
    if (db.documentos[userId]) {
      db.documentos[userId] = db.documentos[userId].filter((d: any) => String(d.id) !== String(docId));
      saveMockDB(db);
    }
    return {} as T;
  }

  throw new Error("Mock API: Ruta no soportada");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      // Si la respuesta no es OK y es un error 502/504 (servidor inaccesible) o 404
      if (res.status === 502 || res.status === 504 || res.status === 404) {
        console.warn(`⚠️ Backend desconectado (Status ${res.status}). Usando Mock API local para: ${path}`);
        return handleMockRequest<T>(path, options);
      }

      const err = await res.json().catch(() => ({ detail: "Error de red" }));
      if (err.detail === "Error de red") {
        console.warn(`⚠️ Error de red/decodificación de respuesta (posible backend apagado). Usando Mock API local para: ${path}`);
        return handleMockRequest<T>(path, options);
      }
      throw new Error(err.detail ?? "Error desconocido");
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    console.warn(`⚠️ Excepción de red atrapada, usando Mock API local para: ${path}`, err);
    return handleMockRequest<T>(path, options);
  }
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
