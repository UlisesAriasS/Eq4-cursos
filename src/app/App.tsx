import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { CompletarPerfil } from './components/CompletarPerfil';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TeacherProfile } from './components/TeacherProfile';
import { GruposColegiados } from './components/GruposColegiados';
import { CuerpoAcademico } from './components/CuerpoAcademico';
import { Tutorias } from './components/Tutorias';
import { ProyectoIntegrador } from './components/ProyectoIntegrador';
import { SolicitudConstancias } from './components/SolicitudConstancias';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">Vista en desarrollo</p>
      </div>
    </div>
  );
}

/* ── Dashboard (solo se renderiza si hay sesión) ────────────────────────── */
function Dashboard() {
  const { docente } = useAuth();
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem('currentView') || 'perfil'
  );

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    localStorage.setItem('currentView', view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'perfil':        return <TeacherProfile />;
      case 'colegiados':    return <GruposColegiados />;
      case 'cuerpo':        return <CuerpoAcademico />;
      case 'tutorias':      return <Tutorias />;
      case 'proyectos':     return <ProyectoIntegrador />;
      case 'expediente':    return <SolicitudConstancias />;
      case 'configuracion': return <Placeholder title="Configuración" />;
      default:              return <Placeholder title="Perfil del Profesor" />;
    }
  };

  return (
    <div className="size-full flex bg-[#f5f6f8]">
      <Sidebar activeView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-hidden">
          {renderView()}
        </main>
      </div>

      {/* Modal de perfil incompleto — se muestra sobre el dashboard */}
      {docente && !docente.perfil_completo && <CompletarPerfil />}
    </div>
  );
}

/* ── Root — maneja el guard de autenticación ─────────────────────────────── */
function AppRoot() {
  const { docente } = useAuth();
  return docente ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}
