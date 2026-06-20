/**
 * LoginPage.tsx
 * Pantalla de inicio de sesión — funcional, sin estilos complejos por ahora.
 */
import { useState, FormEvent } from "react";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    await login(correo, password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#f5f6f8]"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm leading-tight">Universidad</p>
            <p className="text-gray-400 text-xs">Portal Docente</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mb-6">Ingresa tus credenciales institucionales</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Correo institucional
            </label>
            <input
              id="login-correo"
              type="text"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@universidad.edu.mx"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-xl
                       hover:bg-[#2d5280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
