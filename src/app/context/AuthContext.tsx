/**
 * AuthContext.tsx
 * Estado global de autenticación. Persiste en localStorage.
 */
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { api, LoginResponse } from "../services/api";

const STORAGE_KEY = "eq4_session";

// ─── Tipos ─────────────────────────────────────────────────────────────────

interface AuthState extends LoginResponse {}

interface AuthContextValue {
  docente: AuthState | null;
  loading: boolean;
  error: string | null;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  updateDocente: (changes: Partial<AuthState>) => void;
  clearError: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [docente, setDocente] = useState<AuthState | null>(loadSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (correo: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(correo, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setDocente(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('currentView');
    setDocente(null);
    setError(null);
  }, []);

  const updateDocente = useCallback((changes: Partial<AuthState>) => {
    setDocente((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...changes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ docente, loading, error, login, logout, updateDocente, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
