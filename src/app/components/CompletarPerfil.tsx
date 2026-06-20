/**
 * CompletarPerfil.tsx
 * Modal que aparece cuando el perfil académico del docente está incompleto.
 * No se puede cerrar sin completar los campos obligatorios.
 */
import { useState, FormEvent } from "react";
import { GraduationCap, Building2, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const GRADOS = ["Licenciatura", "Especialidad", "Maestría", "Doctorado", "Posdoctorado"];
const CATEGORIAS = [
  "Profesor Titular A", "Profesor Titular B", "Profesor Titular C",
  "Profesor Asociado A", "Profesor Asociado B", "Profesor Asociado C",
  "Profesor de Asignatura",
];

export function CompletarPerfil() {
  const { docente, updateDocente } = useAuth();

  const [grado, setGrado]           = useState(docente?.grado_academico ?? "");
  const [categoria, setCategoria]   = useState(docente?.categoria ?? "");
  const [adscripcion, setAdscripcion] = useState(docente?.adscripcion ?? "");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  if (!docente) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!grado || !categoria || !adscripcion.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await api.updatePerfil(docente.usuario_id, {
        grado_academico: grado,
        categoria,
        adscripcion: adscripcion.trim(),
      });
      updateDocente({
        grado_academico: grado,
        categoria,
        adscripcion: adscripcion.trim(),
        perfil_completo: true,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#1e3a5f]" />
          </div>
          <div>
            <h2 className="text-gray-900 font-semibold text-base">Completa tu perfil académico</h2>
            <p className="text-gray-400 text-xs">Necesitamos algunos datos antes de continuar</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6 mt-1">
          Hola <span className="font-medium text-gray-800">{docente.nombre}</span>, por favor
          completa tu información académica para acceder al sistema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grado académico */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Grado académico
            </label>
            <select
              id="cp-grado"
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            >
              <option value="">Selecciona tu grado...</option>
              {GRADOS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              Categoría docente
            </label>
            <select
              id="cp-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            >
              <option value="">Selecciona tu categoría...</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Adscripción */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              Adscripción (departamento)
            </label>
            <input
              id="cp-adscripcion"
              type="text"
              value={adscripcion}
              onChange={(e) => setAdscripcion(e.target.value)}
              placeholder="Ej: Departamento de Sistemas y Computación"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            id="cp-guardar"
            type="submit"
            disabled={saving || !grado || !categoria || !adscripcion.trim()}
            className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-xl
                       hover:bg-[#2d5280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
