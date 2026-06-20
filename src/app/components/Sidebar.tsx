import {
  UserCircle,
  Users,
  ShieldCheck,
  MessageSquare,
  Briefcase,
  FileCheck,
  Settings,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Perfil del Profesor',   icon: UserCircle,    path: 'perfil'      },
  { name: 'Grupos Colegiados',     icon: Users,         path: 'colegiados'  },
  { name: 'Cuerpo Académico',      icon: ShieldCheck,   path: 'cuerpo'      },
  { name: 'Tutorías',              icon: MessageSquare, path: 'tutorias'    },
  { name: 'Proyecto Integrador',   icon: Briefcase,     path: 'proyectos'   },
  { name: 'Solicitud Constancias', icon: FileCheck,     path: 'expediente'  },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { docente, logout } = useAuth();
  return (
    <aside className="w-64 flex flex-col h-full" style={{ background: '#162d4a' }}>

      {/* Brand header */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white leading-none" style={{ fontSize: '14px', fontWeight: 600 }}>
              Universidad
            </p>
            <p className="text-white/50 mt-0.5" style={{ fontSize: '11px' }}>
              Portal Docente
            </p>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-white/30 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>
          Menú principal
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-white/55 hover:bg-white/8 hover:text-white/90'
                  }`}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`w-0.5 h-5 rounded-full shrink-0 transition-all ${
                      isActive ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 group-hover:text-white/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>
                  <span
                    className="leading-none"
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {item.name}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-0.5">
        <button
          onClick={() => onNavigate('configuracion')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
            activeView === 'configuracion'
              ? 'bg-white/15 text-white'
              : 'text-white/55 hover:bg-white/8 hover:text-white/90'
          }`}
        >
          <span
            className={`w-0.5 h-5 rounded-full shrink-0 ${
              activeView === 'configuracion' ? 'bg-white' : 'bg-transparent'
            }`}
          />
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              activeView === 'configuracion' ? 'bg-white/15 text-white' : 'text-white/50 group-hover:text-white/80'
            }`}
          >
            <Settings className="w-4 h-4" strokeWidth={1.8} />
          </div>
          <span className="leading-none" style={{ fontSize: '13px', fontWeight: activeView === 'configuracion' ? 600 : 400 }}>
            Configuración
          </span>
        </button>

        {/* User chip */}
        <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <UserCircle className="w-4 h-4 text-white/80" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/90 truncate leading-none" style={{ fontSize: '12px', fontWeight: 500 }}>
              {docente?.nombre ?? 'Docente'}
            </p>
            <p className="text-white/40 mt-0.5" style={{ fontSize: '10px' }}>
              {docente?.categoria ?? 'Portal Docente'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
